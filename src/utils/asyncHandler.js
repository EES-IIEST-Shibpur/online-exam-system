// src/utils/asyncHandler.js
// Wrap async route handlers to forward errors to centralized error middleware.

module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
