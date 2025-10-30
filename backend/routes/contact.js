// import express from 'express';
// import { Resend } from 'resend';
// import dotenv from 'dotenv';

// dotenv.config();
// const router = express.Router();
// const resend = new Resend(process.env.RESEND_API_KEY);

// router.post('/', async (req, res) => {
//   const { name, email, message } = req.body;

//   console.log('📨 Incoming contact form:', { name, email, message });

//   if (!name || !email || !message) {
//     return res.status(400).json({ success: false, error: 'Missing fields' });
//   }

//   try {
//     const { data, error } = await resend.emails.send({
//       from: 'Product Pulse <onboarding@resend.dev>',
//       to: process.env.CONTACT_EMAIL,
//       subject: `CUSTOMER FEEDBACK — ${name} via Contact Page`,
//       html: `
//         <p><strong>From:</strong> ${name} (${email})</p>
//         <p><strong>Message:</strong></p>
//         <p>${message}</p>
//       `,
//     });

//     if (error) {
//       console.error('❌ Resend error:', error.message);
//       return res.status(500).json({ success: false, error: 'Email failed to send' });
//     }

//     console.log('✅ Contact form email sent via Resend:', data.id);
//     res.json({ success: true });
//   } catch (err) {
//     console.error('❌ Email send error:', err.message);
//     res.status(500).json({ success: false, error: 'Email failed to send' });
//   }
// });

// export default router;