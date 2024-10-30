import threading
import time
import boto3
import random  # random module to gen test values
from datetime import datetime, timezone
from decimal import Decimal

# init DynamoDB
dynamodb = boto3.resource(
    "dynamodb",
    region_name="us-east-1",
    # key id and secret key
)
table = dynamodb.Table('senior_design_dummy')

# function to simulate GPU metrics with random numbers
def gpu_prober():
    device_id = "test-device-uuid" 
    while True:
        # Generate random test values
        temperature = random.randint(30, 90)  # temp in C
        clock_speed = random.randint(1000, 2000)  # clock speed in MHz
        power_usage = round(random.uniform(50.0, 300.0), 2)  # power usage in W
        memory_used = round(random.uniform(1000.0, 8000.0), 2)  # mem used in MB

        print(f"Temp: {temperature} C, Clock: {clock_speed} MHz, Power: {power_usage} W, Memory Used: {memory_used} MB")
        
        # store generated metrics in DynamoDB
        store_metrics(
            device_id=device_id,
            temperature=temperature,
            clock_speed=clock_speed,
            power_usage=power_usage,
            memory_used=memory_used
        )
        
        time.sleep(1)

# function to store metrics in DynamoDB table
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

def execute_workload():
    print("Executing sample workload...")

def main():
    # run the simulated GPU odometer in its own separate thread
    odometer_thread = threading.Thread(target=gpu_prober)
    odometer_thread.daemon = True  # make sure thread will not block the main process from exiting
    odometer_thread.start()

    execute_workload()

    # keep the main thread alive so the odometer continues running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Exiting")

if __name__ == "__main__":
    main()