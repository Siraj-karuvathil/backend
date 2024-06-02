const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const bluebird = require("bluebird");
const fs = require("fs");
const s3 = require("../../../../utils/s3");
const s3Config = require("../../../../config/s3");
const { MAX_ALLOWED_FILE_COUNT } = require("../../../../config/constants");

// storage
const tmpStorage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, generateRandomFileName(file.originalname));
    },
});

const tmpUpload = multer({ storage: tmpStorage });

const getFileExtension = (fileName) => {
    return fileName.split(".").pop();
};

const generateRandomFileName = (fileName) => {
    return `${uuidv4()}.${getFileExtension(fileName)}`.replace(/ /g, "");
};

const generateS3Key = (file, filePath) => {
    return `${filePath}/${file?.filename ?? generateRandomFileName(file?.originalname)}`;
};

const multerSingleFile = (fileName) => {
    return tmpUpload.single(fileName);
};

const multerMultipleFiles = (fileName, maxCount = MAX_ALLOWED_FILE_COUNT) => {
    return tmpUpload.array(fileName, maxCount);
};

const multerMultipleFields = (fileNames) => {
    return tmpUpload.fields(fileNames);
};

const uploadImage = async (file, filePath = s3Config?.path?.default, acl = s3Config?.acl?.private) => {
    const fileContent = fs.readFileSync(file.path);
    const params = {
        ACL: acl,
        Body: fileContent,
        Bucket: process?.env?.S3_BUCKETNAME,
        Key: generateS3Key(file, filePath),
        ContentType: file?.mimetype,
    };
    const data = await bluebird.promisify(s3.upload.bind(s3))(params);
    console.log(data);
    return {
        bucket: data?.Bucket,
        key: data?.Key,
        url: data?.Location,
        originalName: file?.originalname ?? "",
        mimeType: file?.mimetype ?? "",
        size: file?.size ?? "",
    };
};

const removeFile = async (s3Params) => {
    const params = {
        Bucket: s3Params?.bucket,
        Key: s3Params?.key,
    };
    return await bluebird.promisify(s3.deleteObject.bind(s3))(params);
};

const getFileSignedUrl = async (s3Params) => {
    const params = {
        Bucket: s3Params?.bucket,
        Key: s3Params?.key,
        Expires: s3Config?.presignedUrlExpiresIn,
    };
    return { url: await bluebird.promisify(s3.getSignedUrl.bind(s3))("getObject", params) };
};

module.exports = {
    multerSingleFile,
    multerMultipleFiles,
    multerMultipleFields,
    uploadImage,
    removeFile,
    getFileSignedUrl,
};
