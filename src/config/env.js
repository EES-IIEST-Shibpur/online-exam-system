// src/config/env.js
// Centralized environment loading and basic validations.
// Non-destructive: reads .env and provides defaults where safe.

const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config(); // fallback to default
}

const get = (key, fallback) => {
  const val = process.env[key];
  if (val === undefined || val === '') return fallback;
  return val;
};

const CONFIG = {
  PORT: Number(get('PORT', 8000)),
  MONGO_URI: get('MONGO_URI', ''),
  JWT_SECRET: get('JWT_SECRET', 'change-this-secret'),
  JWT_EXPIRES_IN: get('JWT_EXPIRES_IN', '24h'),
  RATE_LIMIT_WINDOW_MS: Number(get('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000)),
  RATE_LIMIT_MAX: Number(get('RATE_LIMIT_MAX', 100)),
  CLOUDINARY: {
    CLOUD_NAME: get('CLOUDINARY_CLOUD_NAME', process.env.CLOUDINARY_CLOUD_NAME || ''),
    API_KEY: get('CLOUDINARY_API_KEY', process.env.CLOUDINARY_API_KEY || ''),
    API_SECRET: get('CLOUDINARY_API_SECRET', process.env.CLOUDINARY_API_SECRET || ''),
  },
  EMAIL: {
    SERVICE: get('MAIL_SERVICE', process.env.MAIL_SERVICE || ''),
    HOST: get('MAIL_HOST', process.env.MAIL_HOST || ''),
    PORT: Number(get('MAIL_PORT', process.env.MAIL_PORT || 587)),
    SECURE: (get('MAIL_SECURE', process.env.MAIL_SECURE || 'false') === 'true'),
    USER: get('MAIL_USER', process.env.MAIL_USER || ''),
    PASS: get('MAIL_PASS', process.env.MAIL_PASS || ''),
    SENDER: get('MAIL_SENDER', process.env.MAIL_FROM_NAME || process.env.MAIL_FROM_EMAIL || ''),
  },
};

module.exports = CONFIG;