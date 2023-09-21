const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

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

const multerSingleFile = (fileName) => {
    return tmpUpload.single(fileName);
};

const multerMultipleFields = (fileNames) => {
    return tmpUpload.fields(fileNames);
};

module.exports = {
    multerSingleFile,
    multerMultipleFields,
};
