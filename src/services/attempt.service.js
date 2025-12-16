// src/services/attempt.service.js
// Manages exam attempts: start, incremental save, submit, single active attempt enforcement.

const ApiError = require('../utils/ApiError');
const Exam = require('../models/Exam.model');
const ExamAttempt = require('../models/ExamAttempt.model');
const Result = require('../models/Result.model');
const evaluationService = require('./evaluation.service');
const { ATTEMPT_STATUS } = require('../config/constants');

// Helper: server-side current time
const now = () => new Date();

const startAttempt = async ({ examId, userId }) => {
  const exam = await Exam.findById(examId).populate('questions');
  if (!exam) throw new ApiError(404, 'Exam not found');

  // Server is source of truth for time
  const currentTime = now();
  if (exam.startTime && currentTime < exam.startTime) {
    throw new ApiError(403, 'The exam has not started yet.');
  }
  if (exam.endTime && currentTime > exam.endTime) {
    throw new ApiError(403, 'The exam has already ended.');
  }

  // Ensure no active attempt for this user and exam
  const existing = await ExamAttempt.findOne({
    userId,
    examId,
    status: ATTEMPT_STATUS.IN_PROGRESS,
  });

  if (existing) {
    // Return existing attempt (idempotent start)
    return existing;
  }

  const attempt = new ExamAttempt({
    userId,
    examId,
    status: ATTEMPT_STATUS.IN_PROGRESS,
    startedAt: currentTime,
    durationMinutes: exam.duration,
    answers: [],
  });

  await attempt.save();
  return attempt;
};

const saveAnswers = async ({ attemptId, userId, answers = [] }) => {
  const attempt = await ExamAttempt.findById(attemptId);
  if (!attempt) throw new ApiError(404, 'Attempt not found');
  if (!attempt.userId.equals(userId)) throw new ApiError(403, 'Not authorized for this attempt');
  if (attempt.status !== ATTEMPT_STATUS.IN_PROGRESS) throw new ApiError(409, 'Attempt is not in progress');

  // Idempotent: for each answer, upsert in attempt.answers
  const nowTs = now();
  const mapByQuestion = new Map();
  attempt.answers.forEach((a) => mapByQuestion.set(String(a.questionId), a));

  answers.forEach((incoming) => {
    const qid = String(incoming.questionId);
    if (mapByQuestion.has(qid)) {
      const existing = mapByQuestion.get(qid);
      existing.selectedOptionId = incoming.selectedOptionId || existing.selectedOptionId;
      existing.savedAt = nowTs;
    } else {
      attempt.answers.push({
        questionId: incoming.questionId,
        selectedOptionId: incoming.selectedOptionId || null,
        savedAt: nowTs,
      });
    }
  });

  await attempt.save();
  return attempt;
};

const submitAttempt = async ({ attemptId, userId }) => {
  const attempt = await ExamAttempt.findById(attemptId).populate({
    path: 'examId',
    populate: { path: 'questions' },
  });
  if (!attempt) throw new ApiError(404, 'Attempt not found');
  if (!attempt.userId.equals(userId)) throw new ApiError(403, 'Not authorized for this attempt');
  if (attempt.status !== ATTEMPT_STATUS.IN_PROGRESS) throw new ApiError(409, 'Attempt is not in progress');

  // Check duration/expiry server-side
  const startedAt = attempt.startedAt;
  const expireAt = new Date(startedAt.getTime() + attempt.durationMinutes * 60000);
  const currentTime = new Date();
  if (currentTime > expireAt) {
    // Mark expired and trigger evaluation as expired
    attempt.status = ATTEMPT_STATUS.EXPIRED;
    attempt.submittedAt = currentTime;
    await attempt.save();
    // Evaluate the answers available at expiry
    const evaluation = await evaluationService.evaluateAttempt(attempt);
    // Store evaluation result
    const result = new Result({
      studentId: attempt.userId,
      examId: attempt.examId._id,
      score: evaluation.score,
      submittedAt: currentTime,
      answers: attempt.answers.map((a) => ({ questionId: a.questionId, selectedOptionId: a.selectedOptionId })),
    });
    await result.save();
    return { attempt, result, status: 'expired' };
  }

  // Mark submitted, evaluate once
  attempt.status = ATTEMPT_STATUS.SUBMITTED;
  attempt.submittedAt = currentTime;
  await attempt.save();

  // Ensure evaluation runs exactly once
  const evaluation = await evaluationService.evaluateAttempt(attempt);
  // Persist result
  const result = new Result({
    studentId: attempt.userId,
    examId: attempt.examId._id,
    score: evaluation.score,
    submittedAt: currentTime,
    answers: attempt.answers.map((a) => ({ questionId: a.questionId, selectedOptionId: a.selectedOptionId })),
  });
  await result.save();

  // Keep compatibility: return success message
  return { attempt, result, status: 'submitted' };
};

module.exports = {
  startAttempt,
  saveAnswers,
  submitAttempt,
};
