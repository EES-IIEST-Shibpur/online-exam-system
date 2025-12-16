// src/models/Result.model.js
// Stores evaluated result; preserved for compatibility with legacy API.

const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
    score: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedOptionId: { type: mongoose.Schema.Types.ObjectId },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);
