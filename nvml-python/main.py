import threading
import time
# Note use nvidia official release nvidia-ml-py, not unofficial 
import pynvml
from pynvml import *

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

        print(f"Temp: {temperature} C, Clock: {clock_speed} MHz, Power: {last_power_reading} W, Memory Used: {memory_info.used / (1024 ** 2)} MB")
        
        # Poll regularly
        time.sleep(1)

# Our main thread can handle our GPU workloads
def execute_workload():
    print("exeuting our sample workload...")

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
    