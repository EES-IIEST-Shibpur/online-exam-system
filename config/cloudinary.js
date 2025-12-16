const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "process.env.CLOUDINARY_NAME",
    api_key: "CLOUDINARY_KEY",
    api_secret: "CLOUDINARY_SECRET"
});

module.exports = cloudinary;