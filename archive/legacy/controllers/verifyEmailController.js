const nodemailer = require('nodemailer');
const User = require("../models/User");
const generateOTP = require("../utils/otpGenerator");

exports.sendOTP = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: 'Email Verification OTP',
            text: `Your OTP for email verification is ${otp}. It is valid for 10 minutes.`,
        });

        return res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Something went wrong. Please try again later.', error: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        if (!user.otp || user.otpExpiresAt < Date.now()) {
            return res.status(400).json({ status: 'error', message: 'OTP expired or invalid' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ status: 'error', message: 'Incorrect OTP' });
        }

        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        return res.status(200).json({ status: 'success', message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Something went wrong. Please try again later.', error: error.message });
    }
};