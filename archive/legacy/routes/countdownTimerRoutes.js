const express = require('express');
const Countdown = require('../controllers/countdownTimer');
const router = express.Router();

router.get('/', Countdown);

module.exports = router;