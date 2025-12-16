// src/app.js
// Express app entry. Mounts routes preserving legacy API paths.

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { globalLimiter } = require('./middlewares/rateLimit.middleware');
const { verifyToken } = require('./middlewares/auth.middleware');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const authRoutes = require('./routes/auth.routes');
const examRoutes = require('./routes/exam.routes');
const attemptRoutes = require('./routes/attempt.routes');
const legacyRoutes = require('./routes/legacy.routes');

const app = express();

// Basic security headers
app.use(helmet());

// Cors: preserve previous allowedOrigins behaviour if set, else allow all for backward compatibility
const allowedOrigins = [
  'https://apticrack.eesiiests.org',
  'https://admin.apticrack.eesiiests.org',
  'https://online-exam-system-frontend.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);

// request logging (basic)
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/exam-taking', attemptRoutes);

// Legacy compatibility routes grouped
// These preserve routes the frontend depends on.
app.use('/api', verifyToken, legacyRoutes);
app.get('/', (req, res) => {
  res.send('Online Exam System API is running');
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
