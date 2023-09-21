const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = (data) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(data.path, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
};
module.exports = { uploadImage };
