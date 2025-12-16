// src/controllers/legacy/question.legacy.controller.js
// Contains behavior migrated from original controllers to preserve API compatibility.

const express = require('express');
const router = express.Router();
const Question = require('../../models/Question.model');
const cloudinary = require('../../config/legacyCloudinary'); // uses existing config wrapper
const { ROLES } = require('../../config/constants');

// Middleware placeholder for admin
const adminOnly = (req, res, next) => {
  if (req.userRole !== ROLES.ADMIN) return res.status(403).json({ status: 'error', message: 'Insufficient permissions' });
  return next();
};

// Create (multipart) — keep same endpoint and behavior
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/create', adminOnly, upload.single('image'), async (req, res, next) => {
  try {
    const { text, type, category, difficultyLevel } = req.body;
    const options = JSON.parse(req.body.options || '[]');
    if (!Array.isArray(options) || options.length > 4) {
      return res.status(400).json({ status: 'error', message: 'Options should not exceed 4 choices.' });
    }
    const correctOption = options.find((o) => o.isCorrect === true);
    if (!correctOption) return res.status(400).json({ status: 'error', message: 'Correct answer must be one of the options.' });

    let imageUrl = null;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'questions' });
      imageUrl = uploadResult.secure_url;
    }

    const question = new Question({
      text,
      options,
      type,
      category,
      difficultyLevel,
      image: imageUrl,
    });
    await question.save();
    return res.status(201).json({ status: 'success', message: 'Question created successfully', question });
  } catch (err) {
    return next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { difficultyLevel, type, category, keyword } = req.query;
    const filter = {};
    if (difficultyLevel) filter.difficultyLevel = difficultyLevel;
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (keyword) filter.text = { $regex: keyword, $options: 'i' };
    const questions = await Question.find(filter);
    if (!questions || questions.length === 0) return res.status(404).json({ status: 'error', message: 'No questions found matching the criteria.' });
    return res.status(200).json({ status: 'success', data: questions });
  } catch (err) {
    return next(err);
  }
});

// Get by id, update, delete...
router.get('/:id', async (req, res, next) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ status: 'error', message: 'Question not found' });
    return res.status(200).json({ status: 'success', data: q });
  } catch (err) { next(err); }
});

router.put('/:id', adminOnly, async (req, res, next) => {
  try {
    const update = {};
    if (req.body.questionText) update.text = req.body.questionText;
    if (req.body.type) update.type = req.body.type;
    if (req.body.category) update.category = req.body.category;
    if (req.body.difficultyLevel) update.difficultyLevel = req.body.difficultyLevel;
    const updated = await Question.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ status: 'error', message: 'Question not found' });
    return res.status(200).json({ status: 'success', message: 'Question updated successfully', updatedQuestion: updated });
  } catch (err) { next(err); }
});

router.delete('/:id', adminOnly, async (req, res, next) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Question not found' });
    return res.status(200).json({ status: 'success', message: 'Question deleted successfully' });
  } catch (err) { next(err); }
});

module.exports = router;
