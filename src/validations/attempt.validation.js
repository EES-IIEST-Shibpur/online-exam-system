// src/validations/attempt.validation.js
// Validation for exam-taking endpoints.

const { body, param } = require('express-validator');

const startExamValidationRules = [param('examId').isMongoId()];

const submitValidationRules = [
  body('examId').optional().isMongoId(),
  body('attemptId').optional().isMongoId(),
  body('answers').optional().isArray(),
];

module.exports = {
  startExamValidationRules,
  submitValidationRules,
};
