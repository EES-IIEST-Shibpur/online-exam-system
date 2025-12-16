const { query } = require('express-validator');

exports.getExamsValidationRules = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Limit must be a positive integer')
        .toInt(),
    query('title')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 100 })
        .withMessage('Title must not exceed 100 characters'),
    query('startTime')
        .optional()
        .isISO8601()
        .withMessage('Start time must be a valid ISO8601 date'),
    query('endTime')
        .optional()
        .isISO8601()
        .withMessage('End time must be a valid ISO8601 date'),
];