// src/utils/logger.js
// Lightweight logger wrapper using console for compatibility.
// Production could swap to winston or pino without changing callers.

const util = require('util');

const log = (...args) => console.log(...args);
const info = (...args) => console.info(...args);
const warn = (...args) => console.warn(...args);
const error = (...args) => console.error(...args);

const debug = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug(...args);
  }
};

module.exports = {
  log,
  info,
  warn,
  error,
  debug,
  inspect: (obj) => util.inspect(obj, { depth: 3, colors: true }),
};
