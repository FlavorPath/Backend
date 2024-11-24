const AWS = require('aws-sdk');
const uuid = require('uuid').v4;

// AWS S3 설정
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// 파일 업로드 함수
const uploadToS3 = async (file) => {
    const fileKey = `profile-icons/${uuid()}-${file.originalname}`;
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    const result = await s3.upload(params).promise();
    return result.Location; // S3 URL 반환
};

module.exports = { uploadToS3 };
