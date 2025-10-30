// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendConfirmationEmail = async (to, productName) => {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: 'Product Pulse <onboarding@resend.dev>',
//       to,
//       subject: 'Order Confirmation',
//       html: `
//         <h2>Thanks for your purchase!</h2>
//         <p>Your order for <strong>${productName}</strong> is confirmed.</p>
//         <p>We'll be in touch with shipping details soon.</p>
//       `,
//     });

//     if (error) {
//       console.error('❌ Resend error:', error.message);
//     } else {
//       console.log('📨 Email sent via Resend:', data.id);
//     }
//   } catch (err) {
//     console.error('❌ Email send error:', err.message);
//   }
// };