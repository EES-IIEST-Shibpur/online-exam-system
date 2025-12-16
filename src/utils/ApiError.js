// src/utils/ApiError.js
// Custom error class to centralize error handling and HTTP codes.

class ApiError extends Error {
  constructor(statusCode = 500, message = 'Internal Server Error', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
