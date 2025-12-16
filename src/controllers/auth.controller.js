// src/controllers/auth.controller.js
// Thin controller delegating to auth.service while preserving legacy response shapes.

const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const ApiError = require('../utils/ApiError');

const signup = asyncHandler(async (req, res) => {
  const payload = req.body;
  const result = await authService.signup(payload);
  return res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const payload = req.body;
  const result = await authService.login(payload);
  return res.status(200).json(result);
});

module.exports = {
  signup,
  login,
};
