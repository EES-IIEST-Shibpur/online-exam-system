// src/controllers/legacy/result.legacy.controller.js
// Provides /api/results for legacy frontend compatibility.

const express = require('express');
const router = express.Router();
const Result = require('../../models/Result.model');
const Exam = require('../../models/Exam.model');
const ApiError = require('../../utils/ApiError');

// GET /api/results
router.get('/', async (req, res, next) => {
  try {
    const studentId = req.userId;
    const results = await Result.find({ studentId });
    if (!results || results.length === 0) return res.status(404).json({ status: 'error', message: 'No result found' });

    const examIds = results.map((r) => r.examId);
    const exams = await Exam.find({ '_id': { $in: examIds } }).populate('questions');

    const detailedResults = results.map((r) => {
      const exam = exams.find((e) => String(e._id) === String(r.examId));
      const detailedAnswers = r.answers.map((answer) => {
        const question = exam && exam.questions.find((q) => String(q._id) === String(answer.questionId));
        return {
          question: question ? { _id: question._id, text: question.text, image: question.image, options: question.options } : null,
          selectedOption: answer.selectedOptionId,
        };
      });
      return { ...r.toObject(), answers: detailedAnswers };
    });

    return res.status(200).json({ status: 'success', data: detailedResults });
  } catch (err) { next(err); }
});

module.exports = router;
