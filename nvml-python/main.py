import threading
import time
import boto3
from datetime import datetime, timezone
# Note use nvidia official release nvidia-ml-py, not unofficial 
import pynvml
from pynvml import *
from decimal import Decimal

# init DynamoDB 
dynamodb = boto3.resource(
    "dynamodb",
    region_name="us-east-1",
    # key id and secret key
)
table = dynamodb.Table('senior_design_dummy')

def initialize():
    # Initialize NVML
    pynvml.nvmlInit()

    # Get number of devices
    device_count = pynvml.nvmlDeviceGetCount()

    # This will show us all the devices on our system. Will automatically select the highest index device
    for i in range(device_count): 
        handle = pynvml.nvmlDeviceGetHandleByIndex(i)
        name = pynvml.nvmlDeviceGetName(handle); 
        print(f"Device {i}: {name}")  

    driver_version = pynvml.nvmlSystemGetDriverVersion()
    print(f"Driver version: {driver_version}")

    return handle
    
# Function to probe GPU metrics 8=D
def gpu_prober(handle):
    last_power_reading = None
    
    while True:
        temperature = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
        clock_speed = pynvml.nvmlDeviceGetClockInfo(handle, pynvml.NVML_CLOCK_GRAPHICS)
        memory_info = pynvml.nvmlDeviceGetMemoryInfo(handle)
        device_id = pynvml.nvmlDeviceGetUUID(handle)
        
        # power_management_enabled = pynvml.nvmlDeviceGetPowerManagementMode(handle)
        # print(f"Power management enabled: {power_management_enabled}")
        # Cacheing last successful power value
        try:
            power = pynvml.nvmlDeviceGetPowerUsage(handle) / 1000.0 # mW to W
            last_power_reading = power
        except pynvml.NVMLError as err:
            if isinstance(err, pynvml.NVMLError_NoData):
                power = last_power_reading if last_power_reading is not None else "N/A"
            else:
                raise

        print(f"ID: {device_id}, Temp: {temperature} C, Clock: {clock_speed} MHz, Power: {last_power_reading} W, Memory Used: {memory_info.used / (1024 ** 2)} MB")
        
        # store data in DynamoDB table
        store_metrics(
            device_id=device_id,
            temperature=temperature,
            clock_speed=clock_speed,
            power_usage=last_power_reading,
            memory_used=memory_info.used / (1024 ** 2)
        )
        
        # Poll regularly
        time.sleep(1)
        
# Function to store metrics in DynamoDB table
def store_metrics(device_id, temperature, clock_speed, power_usage, memory_used):
    timestamp = datetime.now(timezone.utc)
    
    table.put_item(
        Item={
            'DeviceId': device_id,
            'Timestamp': timestamp.isoformat(),  # convert timestamp to a string format
            'Temperature': Decimal(temperature),
            'ClockSpeed': Decimal(clock_speed),
            'PowerUsage': Decimal(str(power_usage)),  # convert to string first to handle float to Decimal
            'MemoryUsed': Decimal(str(memory_used))   # convert to string first to handle float to Decimal
        }
    )

# Our main thread can handle our GPU workloads
def execute_workload():
    print("executing our sample workload...")

def main():
    handle = initialize()
    
    # Run the GPU odometer in it's own separate thread
    odometer_thread = threading.Thread(target=gpu_prober, args=(handle,))
    odometer_thread.daemon = True  # make sure thread will not block the main process from exiting
    odometer_thread.start()

    execute_workload()

    # Keep our main thread alive so the odometer continues running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Exiting")

    # We need to shutdown the nvml interface 
    pynvml.nvmlShutdown()


if __name__ == "__main__":
    main()
    