// src/middlewares/error.middleware.js
// Centralized error handler. Produces consistent JSON error shape.

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Normalise error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;

  // Log server errors
  if (statusCode >= 500) {
    logger.error('Server error:', err);
  } else {
    logger.warn('Handled error:', message);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    details,
  });
};

module.exports = errorHandler;
