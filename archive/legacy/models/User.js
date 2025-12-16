const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    department: { 
        type: String,
        enum: ["AE&AM", "CE", "CST", "EE", "ETC", "IT", "ME", "MME", "MN"],
        required: true,
    },
    enrollmentNumber: {
        type: String,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpiresAt: {
        type: Date
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);