const { body } = require('express-validator');

const signupValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('department')
        .notEmpty().withMessage('Department is required')
        .isString().withMessage('Department must be a string'),
    body('enrollmentNumber')
        .notEmpty().withMessage('Enrollment number is required'),
    body('year')
        .notEmpty().withMessage('Year is required')
        .isNumeric().withMessage('Year must be a number'),
    body('semester')
        .notEmpty().withMessage('Semester is required')
        .isNumeric().withMessage('Semester must be a number'),
];

module.exports = { signupValidationRules };