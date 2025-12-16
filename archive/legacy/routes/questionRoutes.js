const express = require('express');
const multer = require('multer');
const { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { createQuestionValidator, getQuestionByIdValidator, updateQuestionValidator, deleteQuestionValidator, getAllQuestionsValidator } = require('../validationRules/questionValidator');
const { isAdmin } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(isAdmin);
router.post('/create', upload.single('image'), validate, createQuestion);
router.get('/', getAllQuestionsValidator, validate, getAllQuestions);
router.get('/:id', getQuestionByIdValidator, validate, getQuestionById);
router.put('/:id', updateQuestionValidator, validate, updateQuestion);
router.delete('/:id', deleteQuestionValidator, validate, deleteQuestion);

module.exports = router;