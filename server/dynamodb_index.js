// index.js
const express = require('express');
const dynamoDB = require('./dynamodb');

// init Express app
const app = express();
const port = 3000;

// middleware to parse JSON bodies
app.use(express.json());

// table name
const TABLE_NAME = 'senior_design_dummy';

// POST endpoint to add a new record
app.post('/device', async (req, res) => {
  const { DeviceId, Timestamp, ClockSpeed, MemoryUsage, PowerUsage, Temperature } = req.body;

  // create params for put operation
  const params = {
    TableName: TABLE_NAME,
    Item: {
      DeviceId,
      Timestamp,
      ClockSpeed,
      MemoryUsage,
      PowerUsage,
      Temperature
    }
  };

  try {
    // add item to the DynamoDB table
    await dynamoDB.put(params).promise();
    res.status(201).json({ message: 'Device data added successfully' });
  } catch (error) {
    console.error('Error adding device data:', error);
    res.status(500).json({ error: 'Could not add device data' });
  }
});

// GET endpoint to read a device's data
app.get('/device/:DeviceId', async (req, res) => {
  const { DeviceId } = req.params;

  // create params for get operation
  const params = {
    TableName: TABLE_NAME,
    Key: {
      DeviceId
    }
  };

  try {
    // fetch item from DynamoDB table
    const data = await dynamoDB.get(params).promise();
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.status(404).json({ error: 'Device not found' });
    }
  } catch (error) {
    console.error('Error fetching device data:', error);
    res.status(500).json({ error: 'Could not retrieve device data' });
  }
});

// GET endpoint to retrieve all devices
app.get('/devices', async (req, res) => {
  const params = {
    TableName: TABLE_NAME
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    console.error('Error scanning device data:', error);
    res.status(500).json({ error: 'Could not retrieve devices data' });
  }
});

// start Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});