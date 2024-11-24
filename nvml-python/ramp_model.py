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

# SETUP
# Assuming MTTF_target of 100 years, calculating A
MTTF_target_years = 100
MTTF_target_hours = MTTF_target_years * 365 * 24
T_worst = 85 + 273.15  # Worst-case temperature (K)
V_worst = 1.1          # Worst-case voltage (V)
AF_worst = 1.0         # Worst-case activity factor (example)
delta_T_worst = 30.0   # Worst-case temperature swing (C)
A_TDDB = MTTF_target_hours / ((V_worst**b) * (T_worst**X) * \
                  (10**(Y / T_worst)) * (10**(Z * V_worst / T_worst)))
A_TC = MTTF_target_hours * (delta_T_worst**q)

activation_energy = 0.9
n = 1.1

# Initialize DynamoDB
dynamodb = boto3.resource(
    "dynamodb",
    region_name="us-east-1",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)
table = dynamodb.Table('senior_design_dummy')

def get_latest_metrics(device_id):
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
    
def mttf_electromigration(temp, voltage, power):
    temp += 273.15
    current = power / voltage
    width = 10e-9
    thickness = 50e-9
    area = width * thickness

    #calculate current density
    j = current / area




if __name__ == "__main__":
    device_id = "your_device_id_here"
    metrics = get_latest_metrics(device_id)
    
