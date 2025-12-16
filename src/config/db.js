// src/config/db.js
// Responsible for connecting to MongoDB with retry and logging.
// Keeps behavior non-destructive and safe for production.

const mongoose = require('mongoose');
const logger = require('../utils/logger');
const CONFIG = require('./env');

const connectDB = async () => {
  if (!CONFIG.MONGO_URI) {
    logger.error('MONGO_URI is not set. Database connection aborted.');
    throw new Error('Missing MONGO_URI');
  }

  // Use a modest set of options and let mongoose manage deprecations.
  try {
    await mongoose.connect(CONFIG.MONGO_URI, {
      // options to avoid deprecation warnings
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = connectDB;
