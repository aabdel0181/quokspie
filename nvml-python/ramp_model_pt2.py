# import pynvml
# from pynvml import *
import time
# import threading
import math
import boto3
from dotenv import load_dotenv
import os
from decimal import Decimal

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

def get_latest_metrics(device_id, params=1):
    """
    Retrieve the latest x metrics for a given device ID from the DynamoDB table.
    Consolidates multiple metrics into a single dictionary if x > 1.
    """
    response = table.query(
        KeyConditionExpression="DeviceId = :device_id",
        ExpressionAttributeValues={":device_id": device_id},
        ScanIndexForward=False,  # Get the latest items first
        Limit=params  # Limit to x records
    )
    items = response.get('Items', [])

    if not items:
        return None  # No data found

    if params == 1:
        return items[0]  # Return the latest item as a dictionary

    # Consolidate metrics into a single dictionary
    consolidated = {}
    for item in items:
        for key, value in item.items():
            # Combine metrics with a list for multiple records
            consolidated.setdefault(key, []).append(value)

    return consolidated  # Return a dictionary with lists for multiple records

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
    power = float(metrics['PowerUsage']) # Should be 100s of Watts
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

def thermal_cycling(device_id):
    """
    Check if a thermal cycle occurred based on temperature data.
    """
    temp_metrics = get_latest_metrics(device_id, 120)  # Retrieve 120 records
    if not temp_metrics or 'Temperature' not in temp_metrics:
        print("No temperature data found.")
        return False

    try:
        # Access the list of temperature values, convert to Kelvin
        temperatures = [float(temp) + 273.15 for temp in temp_metrics['Temperature']]
        min_temp = min(temperatures)
        max_temp = max(temperatures)

        # Check if the temperature difference exceeds the threshold
        return (max_temp - min_temp) > 10
    except (TypeError, ValueError) as e:
        print(f"Error processing temperature data: {e}")
        return False


def main():
    device_id = "GPU-bbc80d76-6599-a3e1-0cb6-db0b4fb59df6"  # Taru's device ID
    thermal_cycles = 0

    last_thermal_check = time.time()

    while True:
        # MTTF calculations (every 5 seconds)
        metrics = get_latest_metrics(device_id, 1)
        if metrics:
            MTTF_EM, MTTF_SM, MTTF_TDDB, MTTF_TC, MTTF_overall = mttf_calculations(metrics)
            print(f"Latest Metrics for Device {device_id}:")
            print(f"  Temperature: {metrics['Temperature']} °C")
            print(f"  Voltage: {metrics['Voltage']:.2f} V")
            print(f"  Power Usage: {metrics['PowerUsage']} W")
            print(f"  Delta_T: {metrics['DeltaT']} °C")
            print(f"MTTF Calculations:")
            print(f"  MTTF_EM: {MTTF_EM / (365 * 24):.2f} hours")
            print(f"  MTTF_SM: {MTTF_SM / (365 * 24):.2f} hours")
            print(f"  MTTF_TDDB: {MTTF_TDDB/ (365 * 24):.2f} hours")
            print(f"  MTTF_TC: {MTTF_TC / (365 * 24):.2f} hours")
            print(f"  Overall MTTF: {MTTF_overall:.2f} hours")
        else:
            print(f"No metrics found for Device ID: {device_id}")

        # Thermal cycling check (every 120 seconds)
        current_time = time.time()
        if current_time - last_thermal_check >= 120:
            if thermal_cycling(device_id):
                thermal_cycles += 1
                print(f"Thermal Cycle Detected! Total Cycles: {thermal_cycles}")
            else:
                print("No thermal cycle detected in the last 120 seconds.")
            last_thermal_check = current_time  # Reset the thermal check timer

        time.sleep(5)  # Wait 5 seconds before next MTTF calculation

if __name__ == "__main__":
    main()
