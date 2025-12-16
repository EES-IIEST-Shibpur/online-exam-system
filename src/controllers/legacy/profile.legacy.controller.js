// src/controllers/legacy/profile.legacy.controller.js
// Provides /api/profile compatibility with original behavior.

const express = require('express');
const router = express.Router();
const User = require('../../models/User.model');
const cloudinary = require('../../config/legacyCloudinary');

router.post('/', async (req, res, next) => {
  try {
    const { email, id } = req.body;
    if (id) {
      const userById = await User.findById(id).select('-password');
      if (!userById) return res.status(404).json({ status: 'error', message: 'User not found by Id' });
      return res.status(200).json({ status: 'success', data: userById });
    } else if (email) {
      const userByEmail = await User.findOne({ email }).select('-password');
      if (!userByEmail) return res.status(404).json({ status: 'error', message: 'User not found by email' });
      return res.status(200).json({ status: 'success', data: userByEmail });
    } else {
      const userByToken = await User.findById(req.userId).select('-password');
      if (!userByToken) return res.status(404).json({ status: 'error', message: 'User not found by token' });
      return res.status(200).json({ status: 'success', data: userByToken });
    }
  } catch (err) { next(err); }
});

router.put('/update', async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updated = await User.findByIdAndUpdate(req.userId, { name, phone }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ status: 'error', message: 'User not found' });
    return res.status(200).json({ status: 'success', message: 'Profile updated successfully', data: updated });
  } catch (err) { next(err); }
});

router.put('/change-password', async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ status: 'error', message: 'Incorrect current password' });
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) return res.status(400).json({ status: 'error', message: 'New password cannot be the same as the old password' });
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (err) { next(err); }
});

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload-picture', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ status: 'error', message: 'No file provided for upload.' });
    const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'ProfilePicture' });
    const updatedProfile = await User.findByIdAndUpdate(req.userId, { profilePicture: uploadResult.secure_url }, { new: true });
    if (!updatedProfile) return res.status(404).json({ status: 'error', message: 'User not found.' });
    return res.status(200).json({ status: 'success', message: 'Profile picture updated successfully.', user: updatedProfile });
  } catch (err) { next(err); }
});

module.exports = router;
