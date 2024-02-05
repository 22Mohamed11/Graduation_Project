const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email Options
  const emailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<h1 dir='rtl'>${options.subject}</h1><h2 dir='rtl'>${options.message}</h2>`,
  };

  // Send Email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
