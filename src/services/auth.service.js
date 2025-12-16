// src/services/auth.service.js
// Business logic for authentication. Keeps legacy API shape for responses.

const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User.model');
const CONFIG = require('../config/env');

const signToken = (payload) => {
  return jwt.sign(payload, CONFIG.JWT_SECRET, { expiresIn: CONFIG.JWT_EXPIRES_IN });
};

const signup = async (data) => {
  const { email } = data;
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, 'Email already exists');
  }
  const user = new User(data);
  await user.save();
  return { status: 'success', message: 'User registered successfully' };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'Invalid email or password');

  const match = await user.comparePassword(password);
  if (!match) throw new ApiError(400, 'Invalid email or password');

  const payload = { email: user.email, id: user._id, role: user.role };
  const token = signToken(payload);
  return { status: 'success', message: 'Login successful', token };
};

module.exports = {
  signup,
  login,
  signToken,
};
