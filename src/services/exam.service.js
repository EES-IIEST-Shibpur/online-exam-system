// src/services/exam.service.js
// CRUD and read operations for exams. Validates time windows and preserves legacy behavior.

const Exam = require('../models/Exam.model');
const ApiError = require('../utils/ApiError');

const createExam = async ({ title, description, questions, duration, startTime, endTime, createdBy }) => {
  const exam = new Exam({
    title,
    description,
    questions,
    duration,
    startTime: startTime ? new Date(startTime) : undefined,
    endTime: endTime ? new Date(endTime) : undefined,
    createdBy,
  });
  await exam.save();
  return exam;
};

const getExams = async ({ page = 1, limit = 10, title, startTime, endTime }) => {
  const query = {};
  if (title) query.title = { $regex: title, $options: 'i' };
  if (startTime) query.startTime = { $gte: new Date(startTime) };
  if (endTime) query.endTime = Object.assign(query.endTime || {}, { $lte: new Date(endTime) });

  const skip = (page - 1) * limit;
  const exams = await Exam.find(query).populate('questions').skip(skip).limit(limit);
  const total = await Exam.countDocuments(query);
  if (!exams || exams.length === 0) {
    // Keep legacy behavior where 404 was returned for empty lists
    throw new ApiError(404, 'Exams not found');
  }
  return {
    exams,
    pagination: {
      totalExams: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getExamById = async (id) => {
  const exam = await Exam.findById(id).populate('questions');
  if (!exam) throw new ApiError(404, 'Exam not found');
  return exam;
};

const updateExam = async (id, fields) => {
  const exam = await Exam.findByIdAndUpdate(id, fields, { new: true });
  if (!exam) throw new ApiError(404, 'Exam not found');
  return exam;
};

const deleteExam = async (id) => {
  const exam = await Exam.findByIdAndDelete(id);
  if (!exam) throw new ApiError(404, 'Exam not found');
  return exam;
};

const upcomingExams = async () => {
  const exams = await Exam.find().populate('questions');
  if (!exams || exams.length === 0) throw new ApiError(404, 'Exams not found');
  return exams;
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  upcomingExams,
};
