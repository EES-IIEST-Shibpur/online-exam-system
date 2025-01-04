const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.signup = async (req, res) => {
    const { name, email, password, department, enrollmentNumber, semester, year } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email already exists' });
        }

        const newUser = new User({
            name,
            email,
            password,
            department,
            enrollmentNumber,
            semester,
            year,
        });

        await newUser.save();
        return res.status(201).json({ status: 'success', message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: "error", message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ status: "error", message: 'Invalid email or password' });

        const payload = { email: user.email, id: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.status(200).json({ status: "success", message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Something went wrong. Please try again later." });
    }
};