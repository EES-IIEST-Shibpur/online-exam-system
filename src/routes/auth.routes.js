// src/routes/auth.routes.js
// Preserves legacy routes: /api/auth/signup and /api/auth/login

const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth.controller');
const { body } = require('express-validator');
const validate = require('express-validator').validationResult;
const asyncHandler = require('../utils/asyncHandler');

// Minimal validator runner that returns 400 when validation fails.
const runValidation = (req, res, next) => {
  const errors = validate(req);
  if (!errors.isEmpty && errors.array && errors.array().length) {
    return res.status(400).json({ status: 'error', message: 'Validation error', details: errors.array() });
  }
  return next();
};

router.post(
  '/signup',
  [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('password').isString().isLength({ min: 6 }),
    body('department').isString().notEmpty(),
    body('enrollmentNumber').notEmpty(),
    body('semester').isInt(),
    body('year').isInt(),
  ],
  runValidation,
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').isString().notEmpty(),
  ],
  runValidation,
  login
);

module.exports = router;
