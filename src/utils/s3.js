const AWS = require("aws-sdk");

// Set S3 endpoint
const region = process?.env?.S3_REGION
const s3 = new AWS.S3({
    region,
    accessKeyId: process?.env?.S3_ACCESS_KEY,
    secretAccessKey: process?.env?.S3_SECRET_KEY,
});

module.exports = s3;
