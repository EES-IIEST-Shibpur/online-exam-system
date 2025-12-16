// src/models/User.model.js
// User schema compatible with legacy fields. Password hashing is preserved.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    profilePicture: { type: String },
    department: {
      type: String,
      enum: ['AE&AM', 'CE', 'CST', 'EE', 'ETC', 'IT', 'ME', 'MME', 'MN'],
      required: true,
    },
    enrollmentNumber: { type: String, required: true },
    semester: { type: Number, required: true },
    year: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    isEmailVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

// Hash password when modified
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Instance method for password check
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
