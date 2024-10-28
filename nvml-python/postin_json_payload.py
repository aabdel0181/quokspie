import requests
import time

# Flask server URL to post the data
SERVER_URL = "http://127.0.0.1:5000/post-json-payload"

def post_data(data):
    """
    Send the JSON data to the server at the specified endpoint.
    """
    try:
        # Post data to the server
        response = requests.post(SERVER_URL, json=data)

        # Check the response from the server
        if response.status_code == 201:
            print("Data posted successfully")
        else:
            print(f"Failed to post data. Status code: {response.status_code}, Response: {response.text}")

    except Exception as e:
        print(f"An error occurred while posting data: {e}")

def receive_data_and_post(data):
    """
    This function takes the data received from the other script and posts it to the server.
    """
    print("Received data to post:", data)  # Debugging output
    post_data(data)

def main():
    print("Monitoring script is ready to receive data...")
    
    # Simulate waiting for data to be sent from the other code
    # This loop is just a placeholder to keep the script running
    # and would be replaced by actual data handling in a real scenario
    try:
        while True:
            time.sleep(1)  # Keep the script running
    except KeyboardInterrupt:
        print("Exiting monitoring script")

if __name__ == '__main__':
    main()
