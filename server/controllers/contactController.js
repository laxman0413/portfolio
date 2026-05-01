const nodemailer = require('nodemailer');
const portfolioData = require('../data/data.json');

function buildTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured to send mail');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

async function sendContactMessage(request, response, next) {
  try {
    const { name, email, subject, message } = request.body || {};

    if (!name || !email || !message) {
      response.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      });
      return;
    }

    const transporter = buildTransporter();
    const mailTo = process.env.MAIL_TO || portfolioData.personal.email;
    const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      replyTo: email,
      subject: subject || `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin-bottom: 8px;">New portfolio inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'Portfolio message'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br />')}</p>
        </div>
      `,
    });

    response.status(200).json({
      success: true,
      message: 'Message sent successfully.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendContactMessage,
};