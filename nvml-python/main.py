import threading
import time
import boto3
from datetime import datetime, timezone
# Note use nvidia official release nvidia-ml-py, not unofficial 
import pynvml
from pynvml import *
from decimal import Decimal
from dotenv import load_dotenv
import os

load_dotenv()

# init DynamoDB 
dynamodb = boto3.resource(
    "dynamodb",
    region_name="us-east-1",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)
table = dynamodb.Table('senior_design_dummy')

# Frequency-voltage mapping constants
F_MIN = 300   # Minimum clock frequency in MHz (example)
F_MAX = 1800  # Maximum clock frequency in MHz (example)
V_MIN = 0.8   # Minimum voltage in V (example)
V_MAX = 1.1   # Maximum voltage in V (example)

# Initialize NVML
def initialize():
    pynvml.nvmlInit()

    # Get number of devices
    device_count = pynvml.nvmlDeviceGetCount()

    # This will show us all the devices on our system. Will automatically select the highest index device
    for i in range(device_count): 
        handle = pynvml.nvmlDeviceGetHandleByIndex(i)
        name = pynvml.nvmlDeviceGetName(handle)
        print(f"Device {i}: {name}")  

    driver_version = pynvml.nvmlSystemGetDriverVersion()
    print(f"Driver version: {driver_version}")

    return handle

# Estimate voltage based on clock speed
def approximate_voltage(clock_speed, f_min, f_max, v_min, v_max):
    """Approximate voltage based on clock speed using linear scaling."""
    if clock_speed < f_min:
        clock_speed = f_min
    elif clock_speed > f_max:
        clock_speed = f_max
    voltage = v_min + (v_max - v_min) * (clock_speed - f_min) / (f_max - f_min)
    return voltage

def get_ecc_errors(handle):
    """Retrieve detailed ECC error counts."""
    try:
        memory_error_types = [
            ("Corrected", pynvml.NVML_MEMORY_ERROR_TYPE_CORRECTED),
            ("Uncorrected", pynvml.NVML_MEMORY_ERROR_TYPE_UNCORRECTED),
        ]
        
        total_corrected = 0
        total_uncorrected = 0

        for error_name, error_type in memory_error_types:
            error_count = pynvml.nvmlDeviceGetDetailedEccErrors(
                handle, error_type, pynvml.NVML_MEMORY_LOCATION_ALL
            )
            if error_name == "Corrected":
                total_corrected += error_count
            elif error_name == "Uncorrected":
                total_uncorrected += error_count
        
        return total_corrected, total_uncorrected
    except pynvml.NVMLError as error:
        raise RuntimeError(f"Failed to retrieve detailed ECC errors: {error}")
    

# Poll GPU metrics and calculate delta_T
def gpu_prober(handle):
    last_power_reading = None
    T_min = float('inf')
    T_max = float('-inf')
    ecc_mode = pynvml.nvmlDeviceGetEccMode(handle)
    current_mode = "Enabled" if ecc_mode == pynvml.NVML_FEATURE_ENABLED else "Disabled"
    
    if (current_mode == "Disabled") :
        try:
            pynvml.nvmlDeviceSetEccMode(handle, pynvml.NVML_FEATURE_ENABLED)
            print("ECC Mode enabled successfully.")
        except pynvml.NVMLError as error:
            print(f"Failed to enable ECC mode: {error}")
            if "InsufficientPermissions" in str(error):
                print("You might need administrative privileges to enable ECC.")

    while True:
        temperature = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
        clock_speed = pynvml.nvmlDeviceGetClockInfo(handle, pynvml.NVML_CLOCK_GRAPHICS)
        memory_info = pynvml.nvmlDeviceGetMemoryInfo(handle)
        device_id = pynvml.nvmlDeviceGetUUID(handle)

        # Estimate voltage from clock speed
        voltage = approximate_voltage(clock_speed, F_MIN, F_MAX, V_MIN, V_MAX)

        #check to see the error count (corrected and uncorrected) and location
        if (current_mode == "Enabled"):
           corrected_errors, uncorrected_errors = get_ecc_errors(handle)    

        # Cache last successful power value
        try:
            power = pynvml.nvmlDeviceGetPowerUsage(handle) / 1000.0  # mW to W
            last_power_reading = power
        except pynvml.NVMLError as err:
            if isinstance(err, pynvml.NVMLError_NoData):
                power = last_power_reading if last_power_reading is not None else "N/A"
            else:
                raise

        # Track min and max temperatures for delta_T calculation
        T_min = min(T_min, temperature)
        T_max = max(T_max, temperature)
        delta_T = T_max - T_min
        if delta_T == 0:
            delta_T = 1.0

        print(f"ID: {device_id}, Temp: {temperature} °C, Clock: {clock_speed} MHz, Power: {last_power_reading} W, Memory Used: {memory_info.used / (1024 ** 2):.2f} MB, Voltage: {voltage:.2f} V, Delta_T: {delta_T:.2f} °C, Corrected Errors: {corrected_errors}, Uncorrected Errors: {uncorrected_errors}")

        # Store data in DynamoDB table
        store_metrics(
            device_id=device_id,
            temperature=temperature,
            clock_speed=clock_speed,
            power_usage=last_power_reading,
            memory_used=memory_info.used / (1024 ** 2),
            voltage=voltage,
            delta_T=delta_T,
            corrected_errors=corrected_errors,
            uncorrected_errors=uncorrected_errors
        )

        # Poll regularly
        time.sleep(1)

# Store GPU metrics in DynamoDB
def store_metrics(device_id, temperature, clock_speed, power_usage, memory_used, voltage, delta_T, corrected_errors, uncorrected_errors):
    timestamp = datetime.now(timezone.utc)

    table.put_item(
        Item={
            'DeviceId': device_id,
            'Timestamp': timestamp.isoformat(),  # Convert timestamp to string format
            'Temperature': Decimal(temperature),
            'ClockSpeed': Decimal(clock_speed),
            'PowerUsage': Decimal(str(power_usage)),  # Convert to string first to handle float to Decimal
            'MemoryUsed': Decimal(str(memory_used)),  # Convert to string first to handle float to Decimal
            'Voltage': Decimal(str(voltage)),
            'DeltaT': Decimal(str(delta_T)),
            'CorrectedErrors': Decimal(corrected_errors),
            'UncorrectedErrors': Decimal(uncorrected_errors)
        }
    )

# Our main thread can handle our GPU workloads
def execute_workload():
    print("Executing our sample workload...")

def main():
    handle = initialize()

    # Run the GPU prober in a separate thread
    prober_thread = threading.Thread(target=gpu_prober, args=(handle,))
    prober_thread.daemon = True  # Ensure thread exits with the main process
    prober_thread.start()

    execute_workload()

    # Keep the main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Exiting...")

    # Shutdown NVML
    pynvml.nvmlShutdown()


if __name__ == "__main__":
    main()