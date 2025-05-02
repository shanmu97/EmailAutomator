const nodemailer = require('nodemailer');
const path = require('path');
const { htmlToText } = require('html-to-text'); // Import the module

const uploadFile = async (req, res) => {
  let { emails, subject, text } = req.body;
  const files = req.files;

  // Ensure emails is always an array
  if (typeof emails === 'string') {
    emails = emails.split(',').map(email => email.trim()).filter(Boolean);
  } else if (!Array.isArray(emails)) {
    emails = [emails].filter(Boolean);
  }

  // Convert HTML content to plain text
  const plainText = htmlToText(text || '', { wordwrap: 130 });

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const attachments = files.map(file => ({
    filename: file.originalname,
    path: file.path
  }));

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails.join(','),
    subject: subject,
    text: plainText,      // Plain text version
    html: text,           // Original HTML (optional, but recommended)
    attachments: attachments
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
};

module.exports = {
  uploadFile
};
