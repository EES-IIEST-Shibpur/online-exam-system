const { param } = require('express-validator');

exports.deleteExamValidationRules = [
    param('id')
        .isMongoId()
        .withMessage('Invalid exam ID')
];