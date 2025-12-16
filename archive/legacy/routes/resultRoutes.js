const express = require('express');
const { getResult } = require('../controllers/resultController');
const router = express.Router();

router.get('/', getResult);

module.exports = router;