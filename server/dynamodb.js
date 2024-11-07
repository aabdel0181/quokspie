// dynamodb.js
// need to run this for this to work: npm install express aws-sdk
const AWS = require('aws-sdk');

// config AWS SDK
AWS.config.update({
    region: 'us-east-1', 
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// create DynamoDB DocumentClient
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDB;