// src/validations/exam.validation.js
// Basic validation helpers for exam endpoints using express-validator.

const { body, param, query } = require('express-validator');

const createExamValidationRules = [
  body('title').isString().notEmpty(),
  body('duration').isNumeric().toInt().custom((v) => v > 0),
  body('questions').isArray().optional(),
];

const getExamsValidationRules = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1 }).toInt(),
];

const updateExamValidationRules = [param('id').isMongoId()];

const deleteExamValidationRules = [param('id').isMongoId()];

module.exports = {
  createExamValidationRules,
  getExamsValidationRules,
  updateExamValidationRules,
  deleteExamValidationRules,
};
