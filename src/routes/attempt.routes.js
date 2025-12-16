// src/routes/attempt.routes.js
// Endpoints for starting and submitting exams (/api/exam-taking/*)

const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attempt.controller');
const { verifyToken, requireAuth } = require('../middlewares/auth.middleware');
const validations = require('../validations/attempt.validation');

router.use(verifyToken);
router.post('/start/:examId', validations.startExamValidationRules, requireAuth, attemptController.startExam);
router.post('/submit', validations.submitValidationRules, requireAuth, attemptController.submitExam);

module.exports = router;
