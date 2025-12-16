// src/controllers/attempt.controller.js
// Handles starting, saving answers, and submitting attempts.

const asyncHandler = require('../utils/asyncHandler');
const attemptService = require('../services/attempt.service');
const ApiError = require('../utils/ApiError');

const startExam = asyncHandler(async (req, res) => {
  const examId = req.params.examId;
  const userId = req.userId;
  const attempt = await attemptService.startAttempt({ examId, userId });
  // Return exam details if necessary - populate in service for compatibility
  return res.status(200).json({ status: 'success', data: { attemptId: attempt._id, examId: attempt.examId } });
});

const saveAnswers = asyncHandler(async (req, res) => {
  // Legacy frontend may post incremental saves to /api/exam-taking/submit in older code;
  // Here we provide a dedicated save endpoint to be used internally.
  const { attemptId, answers } = req.body;
  if (!attemptId || !Array.isArray(answers)) {
    throw new ApiError(400, 'Invalid payload');
  }
  const attempt = await attemptService.saveAnswers({ attemptId, userId: req.userId, answers });
  return res.status(200).json({ status: 'success', message: 'Answers saved', attempt });
});

const submitExam = asyncHandler(async (req, res) => {
  // The legacy API expects body { examId, answers } and uses token to identify user.
  // To preserve compatibility, we support both attemptId and examId flows.
  const { attemptId, examId, answers } = req.body;
  let attemptRecord;

  if (attemptId) {
    attemptRecord = await attemptService.saveAnswers({ attemptId, userId: req.userId, answers: answers || [] });
    const result = await attemptService.submitAttempt({ attemptId, userId: req.userId });
    return res.status(200).json({ status: 'success', message: 'Exam submitted successfully' });
  }

  if (!examId) {
    throw new ApiError(400, 'examId is required');
  }

  // Start a new attempt if none exists and then save+submit
  const started = await attemptService.startAttempt({ examId, userId: req.userId });
  await attemptService.saveAnswers({ attemptId: started._id, userId: req.userId, answers: answers || [] });
  await attemptService.submitAttempt({ attemptId: started._id, userId: req.userId });
  return res.status(200).json({ status: 'success', message: 'Exam submitted successfully' });
});

module.exports = {
  startExam,
  saveAnswers,
  submitExam,
};
