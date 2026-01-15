const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    if (!process.env.EMAIL_SERVICE || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email configuration is missing');
    }

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.verify();
    
    const info = await transporter.sendMail({
        from: `"Brain Pal" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    });
    
    return info;
};

module.exports = { sendEmail };