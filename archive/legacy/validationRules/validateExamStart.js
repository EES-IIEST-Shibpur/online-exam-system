const { param } = require('express-validator');

exports.startExamValidationRules = [
    param('examId')
        .isMongoId()
        .withMessage('Invalid exam ID'),
];