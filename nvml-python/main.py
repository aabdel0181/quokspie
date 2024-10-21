import threading
import time
# Note use nvidia official release nvidia-ml-py, not unofficial 
import pynvml
from pynvml import *

# Initialize NVML
pynvml.nvmlInit()

# Get number of devices
device_count = pynvml.nvmlDeviceGetCount()

# This will show us all the devices on our system. Will automiatcally select the highest index device
for i in range(device_count): 
    handle = pynvml.nvmlDeviceGetHandleByIndex(i)
    name = pynvml.nvmlDeviceGetName(handle); 
    print(f"Device {i}: {name}")  

driver_version = pynvml.nvmlSystemGetDriverVersion()
print(f"Driver version: {driver_version}")

# Function to probe GPU metrics 8=D
def gpu_prober():
    while True:
        temperature = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
        clock_speed = pynvml.nvmlDeviceGetClockInfo(handle, pynvml.NVML_CLOCK_GRAPHICS)
        memory_info = pynvml.nvmlDeviceGetMemoryInfo(handle)
        # TODO : Find power bc I only found the depreciated function 

        print(f"Temp: {temperature} C, Clock: {clock_speed} MHz, Power: TODO, Memory Used: {memory_info.used / (1024 ** 2)} MB")
        
        # Poll every second
        time.sleep(1)

# Run the GPU odometer in it's own separate thread
odometer_thread = threading.Thread(target=gpu_prober)
odometer_thread.daemon = True  # make sure thread will not block the main process from exiting
odometer_thread.start()

# Our main thread can handle our GPU workloads
def execute_workload():
    print("exeuting our sample workload...")

execute_workload()

# Keep our main thread alive so the odometer continues running
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Exiting")

# We need to shutdown the nvml interface 
pynvml.nvmlShutdown()
