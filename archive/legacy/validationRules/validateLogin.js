const { body } = require('express-validator');

const loginValidationRules = [
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

module.exports = { loginValidationRules };