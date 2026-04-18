const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER || "test@test.com",
            to,
            subject,
            text,
        });

        console.log("Email sent successfully to " + to);
    } catch (error) {
        console.warn("Mail config bypass:", error.message);
        console.log(`[SIMULATED MAIL TO ${to}]: ${subject} - ${text}`);
    }
};

module.exports = sendEmail;
