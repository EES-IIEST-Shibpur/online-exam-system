const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const examRoutes = require('./routes/examRoutes');
const examTakingRoutes = require('./routes/examTakingRoutes');
const resultRouter = require('./routes/resultRoutes');
const profileRouter = require('./routes/profileRoutes');
const verifyEmailRouter = require('./routes/verifyEmailRoutes');
const countdownRouter = require('./routes/countdownTimerRoutes');
const { verifyToken } = require('./middlewares/authMiddleware');
const requestLogger = require('./middlewares/requestLogger');
const limiter = require('./utils/limiter');

const app = express();

dotenv.config();
connectDB();

const allowedOrigins = [
  'https://apticrack.eesiiests.org',
  'https://admin.apticrack.eesiiests.org',
  'https://online-exam-system-frontend.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(requestLogger);
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/verify-email', verifyEmailRouter);
app.use('/api/countdown', countdownRouter);
app.use(verifyToken);
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/exam-taking', examTakingRoutes);
app.use('/api/results', resultRouter);
app.use('/api/profile', profileRouter);

module.exports = app;