// src/controllers/exam.controller.js
// Exposes exam related endpoints. Keeps same HTTP status codes and messages.

const asyncHandler = require('../utils/asyncHandler');
const examService = require('../services/exam.service');
const ApiError = require('../utils/ApiError');
const { ROLES } = require('../config/constants');

const createExam = asyncHandler(async (req, res) => {
  const payload = req.body;
  payload.createdBy = req.userId || payload.createdBy;
  const exam = await examService.createExam(payload);
  return res.status(201).json({ status: 'success', message: 'Exam created successfully', data: exam });
});

const getExams = asyncHandler(async (req, res) => {
  const data = await examService.getExams(req.query);
  return res.status(200).json({ status: 'success', data });
});

const getExamById = asyncHandler(async (req, res) => {
  const exam = await examService.getExamById(req.params.id);
  return res.status(200).json({ status: 'success', data: { exam } });
});

const updateExam = asyncHandler(async (req, res) => {
  const exam = await examService.updateExam(req.params.id, req.body);
  return res.status(200).json({ status: 'success', message: 'Exam updated successfully', data: { exam } });
});

const deleteExam = asyncHandler(async (req, res) => {
  await examService.deleteExam(req.params.id);
  return res.status(200).json({ status: 'success', message: 'Exam deleted successfully' });
});

const upcomingExams = asyncHandler(async (req, res) => {
  const exams = await examService.upcomingExams();
  return res.status(200).json({ status: 'success', data: exams });
});

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  upcomingExams,
};
