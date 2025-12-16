const express = require('express');
const { changePassword, fetchProfile, updateProfile, uploadPicture } = require('../controllers/profileController');
const { updateProfileValidationRules } = require('../validationRules/validateUpdateProfile');
const { changePasswordValidationRules } = require('../validationRules/validateChangePassword');
const validate = require('../middlewares/validate');
const router = express.Router();

router.post('/', fetchProfile);
router.put('/update', updateProfileValidationRules, validate, updateProfile);
router.put('/change-password', changePasswordValidationRules, validate , changePassword);
router.post('/upload-picture', uploadPicture);

module.exports = router;