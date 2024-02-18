const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAIL_TRAP,
    port:  process.env.PORT_MAIL_TRAP,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

const mailOptions = {
    from: "",
    to: "",
    subject: "",
    text: "",
};

exports.sendMail = async (req, res) => {
    const { to, from, subject, text } = req.body;

    mailOptions.from = from;
    mailOptions.to = to;
    mailOptions.subject = subject;
    mailOptions.text = text;

    try {
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
};