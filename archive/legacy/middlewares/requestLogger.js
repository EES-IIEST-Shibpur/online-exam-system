const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const { method, url } = req;
  const start = Date.now();

  logger.info(`Incoming ${method} request to ${url}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      `Response for ${method} ${url} - Status: ${res.statusCode} - Duration: ${duration}ms`
    );
  });

  next();
};

module.exports = requestLogger;