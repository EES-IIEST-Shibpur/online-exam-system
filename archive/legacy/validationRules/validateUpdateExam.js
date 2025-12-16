const { check, param } = require('express-validator');

exports.updateExamValidationRules = [
    param('id')
        .isMongoId()
        .withMessage('Invalid exam ID'),

    check('title')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 100 })
        .withMessage('Title must not exceed 100 characters'),

    check('description')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),

    check('questions')
        .optional()
        .isArray({ min: 1 })
        .withMessage('Questions must be an array with at least one question'),

    check('duration')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Duration must be a positive integer'),

    check('startTime')
        .optional()
        .isISO8601()
        .withMessage('Start time must be a valid ISO8601 date'),

    check('endTime')
        .optional()
        .isISO8601()
        .withMessage('End time must be a valid ISO8601 date'),
];