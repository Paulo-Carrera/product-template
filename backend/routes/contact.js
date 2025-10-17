import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  console.log('📨 Incoming contact form:', { name, email, message });

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_PASSWORD, // Gmail App Password
    },
  });

  // Optional: verify transport before sending
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Transport verification failed:', error.message);
    } else {
      console.log('✅ Transport is ready to send emails');
    }
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.CONTACT_EMAIL,
    subject: `CUSTOMER FEEDBACK — ${name} via Contact Page`,
    text: message,
    html: `
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Contact form email sent');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    res.status(500).json({ success: false, error: 'Email failed to send' });
  }
});

export default router;