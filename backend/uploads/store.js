const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const uploadFile = (file) => {
  const params = {
    Bucket: 'your-bucket-name',
    Key: file.originalname,
    Body: file.buffer,
    ServerSideEncryption: 'AES256'  // enable AES encryption
  };
  return s3.upload(params).promise();
};

const deleteFileFromS3 = (fileName) => {
    const params = { Bucket: 'your-bucket-name', Key: fileName };
    return s3.deleteObject(params).promise();
  };

  
  module.exports={
    uploadFile,
    deleteFileFromS3,
  }