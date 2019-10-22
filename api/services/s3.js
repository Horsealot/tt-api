const aws = require('aws-sdk');

const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
if (!secretAccessKey) throw new Error("Missing env variable S3_SECRET_ACCESS_KEY");
if (!accessKeyId) throw new Error("Missing env variable S3_ACCESS_KEY_ID");

aws.config.update({
    secretAccessKey,
    accessKeyId,
    signatureVersion: 'v4'
});

const spacesEndpoint = new aws.Endpoint('fra1.digitaloceanspaces.com');
const s3 = new aws.S3({
    endpoint: spacesEndpoint
});

module.exports = s3;
