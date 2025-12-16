const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dwr8472qb",
    api_key: "872674654568337",
    api_secret: "c3968uQj-l8n4EDCQaBjxrQC40g"
});

module.exports = cloudinary;