// src/routes/exam.routes.js
// Routes mirror legacy /api/exams endpoints and protect admin-only paths.

const express = require('express');
const router = express.Router();
const examController = require('../controllers/exam.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { ensureRole } = require('../middlewares/role.middleware');
const { ROLES } = require('../config/constants');
const validate = require('../validations/exam.validation');

router.get('/', validate.getExamsValidationRules, examController.getExams);
router.get('/upcoming', examController.upcomingExams);
router.get('/:id', examController.getExamById);

// Admin-protected routes -- requireAuth then role check
router.use(requireAuth);
router.use((req, res, next) => {
  if (req.userRole !== ROLES.ADMIN) {
    return res.status(403).json({ status: 'error', message: 'Insufficient permissions' });
  }
  next();
});

router.post('/create', validate.createExamValidationRules, examController.createExam);
router.put('/:id', validate.updateExamValidationRules, examController.updateExam);
router.delete('/:id', validate.deleteExamValidationRules, examController.deleteExam);

module.exports = router;
