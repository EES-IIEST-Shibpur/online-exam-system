const express = require('express');
const { signup, login } = require('../controllers/authController');
const { signupValidationRules } = require('../validationRules/validateSignup');
const validate = require('../middlewares/validate');
const { loginValidationRules } = require('../validationRules/validateLogin');
const router = express.Router();

router.post('/signup', signupValidationRules, validate, signup);
router.post('/login', loginValidationRules, validate, login);

module.exports = router;