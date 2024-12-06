# import pynvml
# from pynvml import *
import time
# import threading
import math
import boto3
from dotenv import load_dotenv
import os
from decimal import Decimal
import json
import requests
from datetime import datetime, timezone

load_dotenv()

# CONSTANTS
# Time-dependent dielectric breakdown
a = 78

b = -0.081
X = 0.759
Y = -66.8
Z = -8.37e-4
k = 8.617e-5  # Boltzmann constant in eV/K
# Thermal cycling
q = 2.35
e_aem = 0.9
e_asm = 0.9
n_em = 1.1
n_sm = 2.5

# SETUP
# Assuming MTTF_target of 100 years, calculating A
MTTF_target_years = 100
MTTF_target_hours = MTTF_target_years * 365 * 24
T_worst = 85 + 273.15  # Worst-case temperature (K)
V_worst = 1.1          # Worst-case voltage (V)
AF_worst = 1.0         # Worst-case activity factor (example)
delta_T_worst = 30.0   # Worst-case temperature swing (C)
j_worst = 10**11       # Worst-case current density (A/m^2)
A_TDDB = MTTF_target_hours / ((V_worst**b) * (T_worst**X) * \
                  (10**(Y / T_worst)) * (10**(Z * V_worst / T_worst)))
A_TC = MTTF_target_hours * (delta_T_worst**q)
#A_EM = MTTF_target_hours / ((j_worst**(-1*n_em)) * math.exp(e_aem/(k*T_worst)))
A_SM = MTTF_target_hours / ((delta_T_worst**(-1*n_sm)) * 
                            math.exp(e_aem/(k*T_worst)))

# INITIALIZE DynamoDB
dynamodb = boto3.resource(
    "dynamodb",
    region_name="us-east-1",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)
table = dynamodb.Table('senior_design_dummy')

# TESTING
dummy_temperature = 70.0  
dummy_voltage = 1.05
dummy_power_usage = 150.0 
dummy_delta_t = 15.0 

# TESTING
def get_dummy_metrics(device_id):
    """
    Simulate the latest metrics for a given device ID.
    """
    return {
        "DeviceId": device_id,
        "Temperature": dummy_temperature,
        "Voltage": dummy_voltage,
        "PowerUsage": dummy_power_usage,
        "DeltaT": dummy_delta_t,
    }

def get_latest_metrics(device_id):
    """
    Retrieve the latest metrics for a given device ID from the DynamoDB table.
    """
    response = table.query(
        KeyConditionExpression="DeviceId = :device_id",
        ExpressionAttributeValues={":device_id": device_id},
        ScanIndexForward=False,  # Get the latest items
        Limit=1  # Limit to the latest record
    )
    items = response.get('Items', [])
    if items:
        return items[0]  # Return the latest item
    else:
        return None

def safe_exp(exponent, max_exponent=700):
    """
    Safely compute the exponential to avoid overflow.
    Args:
        exponent (float): The exponent value.
        max_exponent (float): Maximum allowed exponent before clamping.

    Returns:
        float: The result of math.exp or a clamped approximation.
    """
    if exponent > max_exponent:
        return math.exp(max_exponent)  # Prevent overflow by capping
    elif exponent < -max_exponent:
        return 0.0  # Approximation for extremely small exponent
    return math.exp(exponent)

def mttf_calculations(metrics):
    # INSTANTANEOUS MTTF CALCULATION
    temperature = float(metrics['Temperature']) + 273.15  # Convert to Kelvin
    voltage = float(metrics['Voltage'])
    power = float(metrics['PowerUsage'])
    delta_T = float(metrics['DeltaT'])

    #Electromigration MTTF Calculation
    current = power / voltage
    width = 16e-9
    thickness = 32e-9
    area = width * thickness

    j = current / area   # Calculate current density
    print("Current density: ", j)
    exponent_em = e_aem / (k * temperature)
    exp_value_em = safe_exp(exponent_em)
    A_EM = MTTF_target_hours / ((j**(-1*n_em)) * math.exp(e_aem/(k*T_worst)))
    MTTF_EM = A_EM * j**(-1 * n_em) * exp_value_em

    #Stress Migration MTTF Calculation
    exponent_sm = e_asm / (k * temperature)
    exp_value_sm = safe_exp(exponent_sm)
    MTTF_SM = A_SM * abs(500 - temperature)**(-1*n_sm) * exp_value_sm
        
    # TDDB MTTF Calculation
    exponent = (X + Y / temperature + Z * temperature) / (k * temperature)
    exp_value = safe_exp(exponent)
    MTTF_TDDB = A_TDDB * ((1 / voltage)**(a - b * temperature)) * exp_value
    # Thermal Cycling MTTF Calculation
    MTTF_TC = A_TC * (1 / (delta_T**q))

    # Overall MTTF using Sum-of-Failure-Rates (SOFR)
    MTTF_overall = 1 / ((1 / MTTF_TDDB) + (1 / MTTF_TC) + (1 / MTTF_SM) + (1 / MTTF_EM))
    
    return MTTF_EM, MTTF_SM, MTTF_TDDB, MTTF_TC, MTTF_overall

def main():
    device_id = "GPU-bbc80d76-6599-a3e1-0cb6-db0b4fb59df6"  # Taru's device ID
    while True:
        metrics = get_latest_metrics(device_id)
        # if metrics:
        #     MTTF_EM, MTTF_SM, MTTF_TDDB, MTTF_TC, MTTF_overall = mttf_calculations(metrics)
        #     print(f"Latest Metrics for Device {device_id}:")
        #     print(f"  Temperature: {metrics['Temperature']} °C")
        #     print(f"  Voltage: {metrics['Voltage']:.2f} V")
        #     print(f"  Power Usage: {metrics['PowerUsage']} W")
        #     print(f"  Delta_T: {metrics['DeltaT']} °C")
        #     print(f"MTTF Calculations:")
        #     print(f"  MTTF_EM: {MTTF_EM:.2f} hours")
        #     print(f"  MTTF_SM: {MTTF_SM:.2f} hours")
        #     print(f"  MTTF_TDDB: {MTTF_TDDB:.2f} hours")
        #     print(f"  MTTF_TC: {MTTF_TC:.2f} hours")
        #     print(f"  Overall MTTF: {MTTF_overall:.2f} hours")
        # else:
        #     print(f"No metrics found for Device ID: {device_id}")
            
        if metrics:
            MTTF_EM, MTTF_SM, MTTF_TDDB, MTTF_TC, MTTF_Overall = mttf_calculations(metrics)
            
            # prep data to send
            ramp_data = {
                "gpu_id": device_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "temperature": metrics["Temperature"],
                "voltage": metrics["Voltage"],
                "power_usage": metrics["PowerUsage"],
                "delta_t": metrics["DeltaT"],
                "mttf_em": Decimal(MTTF_EM),  # MTTF_EM and others may be Decimal
                "mttf_sm": Decimal(MTTF_SM),
                "mttf_tddb": Decimal(MTTF_TDDB),
                "mttf_tc": Decimal(MTTF_TC),
                "mttf_overall": Decimal(MTTF_Overall),
            }

            # Convert all Decimal objects to float
            def convert_decimal(obj):
                if isinstance(obj, Decimal):
                    return float(obj)  # Or str(obj) if high precision is required
                raise TypeError

           # send data to API
            try:
                response = requests.post(
                    "http://localhost:9000/ramp-results",
                    json=json.loads(json.dumps(ramp_data, default=convert_decimal))  # Serialize with Decimal conversion
                )
                if response.status_code == 200:
                    print("Data successfully inserted into ramp_model_results.")
                else:
                    print(f"Failed to insert data: {response.text}")
            except requests.RequestException as e:
                print(f"Error sending data to server: {e}")
        else:
            print(f"No metrics found for Device ID: {device_id}")

        time.sleep(5)  # Wait before querying again

if __name__ == "__main__":
    main()
