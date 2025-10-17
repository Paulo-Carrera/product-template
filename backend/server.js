import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { insertOrder } from './supabase/insertOrder.js';
import contactRoute from './routes/contact.js'; // ✅ new import

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// ✅ Contact form route
app.use('/contact', contactRoute);

// ✅ Stripe checkout route
app.post('/create-checkout-session', async (req, res) => {
  const { product, customerEmail } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.image],
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
      customer_email: customerEmail,
    });

    await insertOrder({
      productName: product.name,
      status: 'initiated',
      email: customerEmail,
      stripeSessionId: session.id,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);

    await insertOrder({
      productName: product?.name || 'unknown',
      status: 'failed',
      email: customerEmail || 'unknown',
      stripeSessionId: 'none',
    });

    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => console.log('🚀 Backend running on http://localhost:4242'));