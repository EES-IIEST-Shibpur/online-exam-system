const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createExam, getExams, getExamById, updateExam, deleteExam, upcomingExams } = require('../controllers/examController');
const { createExamValidationRules } = require('../validationRules/validateCreateExam');
const { getExamsValidationRules } = require('../validationRules/validateGetAllExams');
const { updateExamValidationRules } = require('../validationRules/validateUpdateExam');
const { deleteExamValidationRules } = require('../validationRules/validateDeleteExam');
const router = express.Router();

router.get('/', getExamsValidationRules, validate, getExams);
router.get('/upcoming', validate , upcomingExams);
router.get('/:id', getExamById);
router.use(isAdmin);
router.post('/create',createExamValidationRules, validate, createExam);
router.put('/:id', updateExamValidationRules, validate, updateExam);
router.delete('/:id', deleteExamValidationRules, validate , deleteExam);

module.exports = router;