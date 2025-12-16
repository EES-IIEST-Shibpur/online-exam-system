// src/services/evaluation.service.js
// Evaluation isolated so it can be tested and run exactly once per attempt.
// Only evaluates objective questions automatically.

const Question = require('../models/Question.model');
const ApiError = require('../utils/ApiError');

const evaluateAttempt = async (attempt) => {
  if (!attempt) throw new ApiError(400, 'Invalid attempt for evaluation');

  // attempt.examId should be populated with questions (service ensures it when called)
  const exam = attempt.examId;
  const questions = Array.isArray(exam.questions) ? exam.questions : [];

  // Create map of questionId -> question object
  const qMap = new Map();
  questions.forEach((q) => qMap.set(String(q._id), q));

  let score = 0;
  // For each saved answer, compare selectedOptionId with question's correct option(s)
  attempt.answers.forEach((ans) => {
    const q = qMap.get(String(ans.questionId));
    if (!q) return;
    // For single-correct: find option where isCorrect true
    if (q.type === 'single-correct') {
      const correct = q.options.find((o) => o.isCorrect);
      if (!correct) return;
      if (String(correct._id) === String(ans.selectedOptionId)) {
        score += 1;
      }
    } else if (q.type === 'multi-correct') {
      // For multi-correct scoring policy: award 1 if any selected matches any correct (legacy simple policy).
      const selected = ans.selectedOptionId ? [String(ans.selectedOptionId)] : [];
      const correctIds = q.options.filter((o) => o.isCorrect).map((o) => String(o._id));
      const matched = selected.some((sid) => correctIds.includes(sid));
      if (matched) score += 1;
    }
  });

  return { score };
};

module.exports = {
  evaluateAttempt,
};
