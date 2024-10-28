#Setup of data base model using mongoDB
import json
import os
from flask import Flask, request, jsonify
from pymongo import MongoClient
import subprocess

# Initialize the Flask application
app = Flask(__name__)

# Configure the MongoDB client
mongo_client = MongoClient('mongodb+srv://atewfik1:SeniorDesign2024_team20@gpu-characterization.2q4j9.mongodb.net/')  # MongoDB connection string
db = mongo_client['gpu_characterization']  # database name

@app.route('/post-json-payload', methods=['POST'])
def post_json_payload():
    # Get the JSON payload from the request
    data = request.json

    # Validate the data structure
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON payload provided"}), 400

    # Separate the data based on keys and process it
    for key, value in data.items():
        if key not in ['Clock', 'Memory Used', 'Temp', 'Power']:
            return jsonify({"error": f"Unexpected key: {key}"}), 400

        # Post the separated JSON object to the specified MongoDB collection
        collection = db[key] 
        if isinstance(value, list):
            collection.insert_many(value)
        else:
            collection.insert_one(value)

    return jsonify({"message": "Data posted successfully"}), 201

@app.route('/get-data/<collection_name>', methods=['GET'])
def get_data(collection_name):
    # Fetch all documents from the specified collection
    collection = db[collection_name]
    data_entries = list(collection.find())

    # Convert the data entries to a list of dictionaries and exclude the '_id' field
    data_list = [{key: value for key, value in entry.items() if key != '_id'} for entry in data_entries]

    return jsonify(data_list), 200


@app.route('/')
def home():
    return "Welcome to the Flask API server!", 200

if __name__ == '__main__':
    # Start postin_json_payload for real time updating
    script_path = os.path.join(os.getcwd(), 'postin_json_payload.py')
    subprocess.Popen(['python3', script_path])

    app.run(debug=True)

