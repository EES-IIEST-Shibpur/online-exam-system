const { check, body } = require('express-validator');

exports.submitExamValidationRules = [
    check('examId')
        .trim()
        .notEmpty()
        .withMessage('Exam ID is required')
        .isMongoId()
        .withMessage('Invalid Exam ID format'),
    body('answers')
        .isArray({ min: 1 })
        .withMessage('Answers must be an array with at least one answer'),
    body('answers.*.questionId')
        .trim()
        .notEmpty()
        .withMessage('Question ID is required for each answer')
        .isMongoId()
        .withMessage('Invalid Question ID format'),
    body('answers.*.selectedOption')
        .trim()
        .notEmpty()
        .withMessage('Selected option is required for each answer')
        .isMongoId()
        .withMessage('Invalid Option ID format'),
];