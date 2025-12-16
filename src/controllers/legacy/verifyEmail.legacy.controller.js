// src/controllers/legacy/verifyEmail.legacy.controller.js
// Provides /api/verify-email/send-otp and /api/verify-email/verify-otp

const express = require('express');
const router = express.Router();
const User = require('../../models/User.model');
const generateOTP = require('../../utils/otpGenerator');
const { sendEmail } = require('../../services/email.service');

const CONFIG = require('../../config/env');

router.get('/send-otp', async (req, res, next) => {
    try {
        const email = req.query.email || req.body.email;
        if (!email) return res.status(400).json({ status: 'error', message: 'email is required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        const body = `Your OTP for email verification is ${otp}. It is valid for 10 minutes.`;
        await sendEmail(email, 'Email Verification OTP', body);

        return res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
    } catch (err) { next(err); }
});

router.post('/verify-otp', async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ status: 'error', message: 'email and otp required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        if (!user.otp || user.otpExpiresAt < Date.now()) return res.status(400).json({ status: 'error', message: 'OTP expired or invalid' });
        if (user.otp !== otp) return res.status(400).json({ status: 'error', message: 'Incorrect OTP' });

        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();
        return res.status(200).json({ status: 'success', message: 'Email verified successfully' });
    } catch (err) { next(err); }
});

module.exports = router;
