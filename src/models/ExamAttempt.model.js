// src/models/ExamAttempt.model.js
// Tracks per-user attempts. Indexed for common queries per non-functional requirements.

const mongoose = require('mongoose');
const { ATTEMPT_STATUS } = require('../config/constants');

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedOptionId: { type: mongoose.Schema.Types.ObjectId, required: false }, // optional for unanswered
    savedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
    status: { type: String, enum: Object.values(ATTEMPT_STATUS), default: ATTEMPT_STATUS.IN_PROGRESS, index: true },
    startedAt: { type: Date, required: true },
    submittedAt: { type: Date },
    durationMinutes: { type: Number, required: true }, // duration snapshot at start
    answers: { type: [answerSchema], default: [] },
    score: { type: Number }, // filled after evaluation
  },
  { timestamps: true }
);

// One active attempt per user per exam is enforced at service level.
// Indexes for fast lookups:
attemptSchema.index({ userId: 1, examId: 1, status: 1 });

module.exports = mongoose.model('ExamAttempt', attemptSchema);
