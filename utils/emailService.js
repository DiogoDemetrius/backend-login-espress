const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.sendEmail = async (to, subject, text) => {
    return transporter.sendMail({ to, subject, text });
};
