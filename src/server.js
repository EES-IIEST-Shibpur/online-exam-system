// src/server.js
// Server bootstrap: connects to DB and starts listening.

const app = require('./app');
const connectDB = require('./config/db');
const CONFIG = require('./config/env');
const logger = require('./utils/logger');

const start = async () => {
  try {
    await connectDB();
    const PORT = CONFIG.PORT || 8000;
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
