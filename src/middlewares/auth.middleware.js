// src/middlewares/auth.middleware.js
// Verifies JWT and attaches userId and role to request object. Non-breaking defaults maintained.

const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const CONFIG = require('../config/env');

const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    // For legacy compatibility, some endpoints might be public; we just skip attaching user when absent.
    return next();
  }
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    return next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

const requireAuth = (req, res, next) => {
  if (!req.userId) {
    return next(new ApiError(401, 'Authentication required'));
  }
  return next();
};

module.exports = {
  verifyToken,
  requireAuth,
};
