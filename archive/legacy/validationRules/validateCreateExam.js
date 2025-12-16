const { check } = require('express-validator');

exports.createExamValidationRules = [
    check('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title must not exceed 100 characters'),
    check('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    check('questions')
        .isArray({ min: 1 })
        .withMessage('At least one question must be provided'),
    check('duration')
        .isInt({ min: 1 })
        .withMessage('Duration must be a positive integer'),
    check('startTime')
        .notEmpty()
        .withMessage('Start time is required')
        .isISO8601()
        .withMessage('Invalid start time format'),
    check('endTime')
        .notEmpty()
        .withMessage('End time is required')
        .isISO8601()
        .withMessage('Invalid end time format')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startTime)) {
                throw new Error('End time must be after the start time');
            }
            return true;
        }),
];