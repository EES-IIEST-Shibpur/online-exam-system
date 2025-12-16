const { body } = require('express-validator');

exports.updateProfileValidationRules = [
    body('name')
        .optional()
        .isString()
        .withMessage('Name should be a string'),
    body('phone')
        .optional()
        .isString()
        .isLength({ min: 10, max: 15 })
        .withMessage('Phone number should be between 10 and 15 characters')
];