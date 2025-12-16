const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/verifyEmailController');
const router = express.Router();

router.get('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;