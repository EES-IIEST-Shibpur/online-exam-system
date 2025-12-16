// src/models/Question.model.js
// Question schema with options and validation matching legacy behavior.

const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: { type: [optionSchema], required: true },
    type: { type: String, enum: ['multi-correct', 'single-correct'], required: true },
    category: { type: String, required: true },
    difficultyLevel: { type: String, enum: ['easy', 'moderate', 'tough'], default: 'moderate' },
    image: { type: String },
  },
  { timestamps: true }
);

questionSchema.path('options').validate(function (opts) {
  return Array.isArray(opts) && opts.length <= 4 && opts.length >= 2;
}, 'A question must have between 2 and 4 options.');

module.exports = mongoose.model('Question', questionSchema);
