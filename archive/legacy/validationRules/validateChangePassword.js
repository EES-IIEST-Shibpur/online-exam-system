const { body } = require('express-validator');

exports.changePasswordValidationRules = [
    body('oldPassword')
        .exists()
        .withMessage('Old password is required'),
    body('newPassword')
        .exists()
        .withMessage('New password is required')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters')
];