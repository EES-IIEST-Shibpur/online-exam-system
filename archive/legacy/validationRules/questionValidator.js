const { body, param, query } = require('express-validator');

exports.createQuestionValidator = [
  body('text')
    .notEmpty()
    .withMessage('Question text is required.')
    .isString()
    .withMessage('Question text must be a string.'),
  body('options')
    .isArray({ min: 2, max: 4 })
    .withMessage('Options must be an array with 2-4 choices.')
    .custom((options) => {
      if (!options.some((option) => option.isCorrect)) {
        throw new Error('At least one option must be marked as correct.');
      }
      return true;
    }),
  body('options.*.text')
    .notEmpty()
    .withMessage('Each option must have text.')
    .isString()
    .withMessage('Option text must be a string.'),
  body('options.*.isCorrect')
    .isBoolean()
    .withMessage('Option correctness must be a boolean.'),
  body('type')
    .notEmpty()
    .withMessage('Question type is required.')
    .isIn(['multi-correct', 'single-correct'])
    .withMessage('Type must be "multi-correct" or "single-correct".'),
  body('category')
    .notEmpty()
    .withMessage('Category is required.')
    .isString()
    .withMessage('Category must be a string.'),
  body('difficultyLevel')
    .notEmpty()
    .withMessage('Difficulty level is required.')
    .isIn(['easy', 'moderate', 'tough'])
    .withMessage('Difficulty level must be "easy", "moderate", or "tough".'),
];

exports.getQuestionByIdValidator = [
  param('id').isMongoId().withMessage('Invalid question ID format.'),
];

exports.updateQuestionValidator = [
  param('id').isMongoId().withMessage('Invalid question ID format.'),
  body('text')
    .optional()
    .isString()
    .withMessage('Question text must be a string.'),
  body('type')
    .optional()
    .isIn(['multi-correct', 'single-correct'])
    .withMessage('Type must be "multi-correct" or "single-correct".'),
  body('category')
    .optional()
    .isString()
    .withMessage('Category must be a string.'),
  body('difficultyLevel')
    .optional()
    .isIn(['easy', 'moderate', 'tough'])
    .withMessage('Difficulty level must be "easy", "moderate", or "tough".'),
];

exports.deleteQuestionValidator = [
  param('id').isMongoId().withMessage('Invalid question ID format.'),
];

exports.getAllQuestionsValidator = [
  query('difficultyLevel')
    .optional()
    .isIn(['easy', 'moderate', 'tough'])
    .withMessage('Difficulty level must be "easy", "moderate", or "tough".'),
  query('type')
    .optional()
    .isIn(['multi-correct', 'single-correct'])
    .withMessage('Type must be "multi-correct" or "single-correct".'),
  query('keyword')
    .optional()
    .isString()
    .withMessage('Keyword must be a string.'),
];