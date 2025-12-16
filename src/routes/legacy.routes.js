// src/routes/legacy.routes.js
// Compatibility layer exposing other legacy routes used by frontend:
// /api/questions, /api/results, /api/profile, /api/verify-email, /api/countdown
// These routes delegate to minimal controllers adapted from legacy code to avoid breaking frontend.

const express = require('express');
const router = express.Router();
const questionController = require('../controllers/legacy/question.legacy.controller');
const resultController = require('../controllers/legacy/result.legacy.controller');
const profileController = require('../controllers/legacy/profile.legacy.controller');
const verifyEmailController = require('../controllers/legacy/verifyEmail.legacy.controller');
const countdownController = require('../controllers/legacy/countdown.legacy.controller');

// Questions endpoints (admin protected where needed)
router.use('/questions', questionController);

// Results
router.use('/results', resultController);

// Profile
router.use('/profile', profileController);

// Verify email
router.use('/verify-email', verifyEmailController);

// Countdown
router.use('/countdown', countdownController);

module.exports = router;
