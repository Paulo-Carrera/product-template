import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendConfirmationEmail = async (to, productName) => {
  await transporter.sendMail({
    from: `"Product Pulse" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Order Confirmation',
    html: `
      <h2>Thanks for your purchase!</h2>
      <p>Your order for <strong>${productName}</strong> is confirmed.</p>
      <p>We'll be in touch with shipping details soon.</p>
    `,
  });
};