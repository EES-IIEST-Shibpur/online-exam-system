// src/config/legacyCloudinary.js
// Provides the same cloudinary.v2 instance as legacy code did, but prefers env vars.
// This preserves runtime behavior while allowing safer config later.

const cloudinary = require('cloudinary').v2;
const CONFIG = require('./env');

// If env vars available, prefer them; otherwise legacy hardcoded values may have been used.
cloudinary.config({
  cloud_name: CONFIG.CLOUDINARY.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: CONFIG.CLOUDINARY.API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: CONFIG.CLOUDINARY.API_SECRET || process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
