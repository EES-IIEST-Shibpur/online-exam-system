const transporter = require("../utils/mailer");
require('dotenv').config();

async function sendEmail(to, subject, text, html) {
    return transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
        to,
        subject,
        text,
    });
}

module.exports = {
    sendEmail
};