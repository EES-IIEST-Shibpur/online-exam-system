const nodemailer = require("nodemailer");
const CONFIG = require("../config/env");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: CONFIG.EMAIL.HOST,
    port: Number(CONFIG.EMAIL.PORT),
    secure: CONFIG.EMAIL.SECURE,
    auth: {
        user: CONFIG.EMAIL.USER,
        pass: CONFIG.EMAIL.PASS,
    },
});

module.exports = transporter;