const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
    if (!process.env.EMAIL_SERVICE || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email configuration is missing');
    }

    const emailPass = process.env.EMAIL_PASS.trim().replace(/\s+/g, '');
    const emailUser = process.env.EMAIL_USER.trim();
    const emailService = process.env.EMAIL_SERVICE.trim().toLowerCase();

    const transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    await transporter.verify();
    
    const mailOptions = {
        from: `"StudyBuddy" <${emailUser}>`,
        to,
        subject,
        text,
    };

    if (html) {
        mailOptions.html = html;
    }
    
    return await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };