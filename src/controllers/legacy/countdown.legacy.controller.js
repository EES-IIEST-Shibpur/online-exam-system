// src/controllers/legacy/countdown.legacy.controller.js
// Keeps a fixed target timestamp as legacy code did.

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const targetTime = new Date('2024-12-31T18:12:00').getTime();
  return res.status(200).json({ status: 'success', data: targetTime });
});

module.exports = router;
