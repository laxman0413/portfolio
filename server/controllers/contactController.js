const nodemailer = require('nodemailer');
const portfolioData = require('../data/data.json');

function isTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value || '').toLowerCase());
}

function sanitizeText(value) {
  return String(value || '').trim();
}

function buildTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE ? isTruthy(process.env.SMTP_SECURE) : port === 465;

  if (!host || !user || !pass) {
    throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured to send mail');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    requireTLS: process.env.SMTP_REQUIRE_TLS ? isTruthy(process.env.SMTP_REQUIRE_TLS) : false,
  });
}

async function sendContactMessage(request, response, next) {
  try {
    const name = sanitizeText(request.body?.name);
    const email = sanitizeText(request.body?.email);
    const subject = sanitizeText(request.body?.subject);
    const message = sanitizeText(request.body?.message);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      response.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      });
      return;
    }

    if (!emailPattern.test(email)) {
      response.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
      return;
    }

    const transporter = buildTransporter();
    const mailTo = process.env.MAIL_TO || portfolioData.personal.email;

    await transporter.sendMail({
      from: email,
      to: mailTo,
      replyTo: email,
      subject: subject || `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || 'Portfolio message'}\n\n${message}`,
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
    if (error && typeof error === 'object' && error.code) {
      console.error('Mail send failed:', {
        code: error.code,
        response: error.response,
        command: error.command,
      });
    }
    next(error);
  }
}

module.exports = {
  sendContactMessage,
};