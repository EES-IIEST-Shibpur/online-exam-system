// src/middlewares/role.middleware.js
// Simple role guard middleware.

const ApiError = require('../utils/ApiError');

const ensureRole = (requiredRole) => (req, res, next) => {
  const role = req.userRole;
  if (!role) return next(new ApiError(401, 'Authentication required'));
  if (role !== requiredRole) return next(new ApiError(403, 'Insufficient permissions'));
  return next();
};

module.exports = {
  ensureRole,
};
