const express = require('express');
const { startExam, submitExam } = require('../controllers/examTakingController');
const { submitExamValidationRules } = require('../validationRules/validateExamSubmit');
const validate = require('../middlewares/validate');
const { startExamValidationRules } = require('../validationRules/validateExamStart');
const router = express.Router();

router.post('/submit', submitExamValidationRules, validate, submitExam);
router.post('/start/:examId', startExamValidationRules, validate, startExam);

module.exports = router;