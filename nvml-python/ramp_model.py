import boto3
from dotenv import load_dotenv
import os
from decimal import Decimal

load_dotenv()

#Constants
activation_energy = 0.9
boltzmann_constant = 8.617e-5
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
    
