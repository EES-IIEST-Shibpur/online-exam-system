// src/middlewares/rateLimit.middleware.js
// Express rate limiter for exam related routes to prevent abuse.

const rateLimit = require('express-rate-limit');
const CONFIG = require('../config/env');

const createLimiter = (options = {}) =>
  rateLimit({
    windowMs: CONFIG.RATE_LIMIT_WINDOW_MS,
    max: CONFIG.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    ...options,
  });

module.exports = {
  globalLimiter: createLimiter(),
  strictLimiter: createLimiter({ max: Math.max(10, Math.floor(CONFIG.RATE_LIMIT_MAX / 4)) }),
};
