import { getSupabaseClient } from './supabase/client.js';
const supabase = getSupabaseClient();

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { insertOrder } from './supabase/insertOrder.js';
import contactRoute from './routes/contact.js';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe requires raw body for webhook verification
app.use('/webhook', express.raw({ type: 'application/json' }));

app.use(cors());
app.use(express.json());

// Contact form route
app.use('/contact', contactRoute);

// Stripe checkout route — logs 'initiated'
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
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:5173/cancel',
      customer_email: customerEmail,
      metadata: {
        productName: product.name,
      },
    });

    // Log initiated order
    await insertOrder({
      product_name: product.name,
      status: 'initiated',
      email: customerEmail,
      stripe_session_id: session.id,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);

    // Log failed attempt
    await insertOrder({
      product_name: product?.name || 'unknown',
      status: 'failed',
      email: customerEmail || 'unknown',
      stripe_session_id: 'none',
    });

    res.status(500).json({ error: err.message });
  }
});

// Stripe webhook — updates status to 'completed' or 'failed'
app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('🔥 /webhook route triggered');
  console.log('📦 Stripe event type:', event.type);

  const session = event.data.object;
  const email = session.customer_details?.email || 'unknown';
  const product_name = session.metadata?.productName || 'unknown';

  console.log('Webhook received session ID:', session.id);
  console.log('Webhook received customer email:', email);

  if (event.type === 'checkout.session.completed') {
    console.log('✅ Payment completed. Checking for matching order...');

    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();

    if (fetchError || !existingOrder) {
      console.error('❌ No matching order found for session ID:', session.id);
    } else {
      console.log('🔍 Found matching order:', existingOrder);

      const { data: updateData, error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          email,
          product_name,
        })
        .eq('stripe_session_id', session.id);

      if (updateError) {
        console.error('❌ Supabase update error:', updateError);
      } else {
        console.log('✅ Supabase update result:', updateData);
      }
    }
  }

  if (event.type === 'checkout.session.expired') {
    console.log('⚠️ Session expired. Checking for matching order...');

    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();

    if (fetchError || !existingOrder) {
      console.error('❌ No matching order found for session ID:', session.id);
    } else {
      console.log('🔍 Found matching order:', existingOrder);

      const { data: updateData, error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'failed',
          email,
          product_name,
        })
        .eq('stripe_session_id', session.id);

      if (updateError) {
        console.error('❌ Supabase update error:', updateError);
      } else {
        console.log('✅ Supabase update result:', updateData);
      }
    }
  }

  res.status(200).json({ received: true });
});

// Order details route for frontend success page
app.get('/order-details', async (req, res) => {
  const { session_id } = req.query;
  console.log('Looking up order details for session ID:', session_id);

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', session_id)
    .single();

  console.log('Supabase returned:', data);

  if (error || !data) {
    console.error('❌ Supabase fetch error:', error);
    return res.status(500).json({ error: 'Order not found' });
  }

  res.json(data);
});

app.listen(4242, () => console.log('🚀 Backend running on http://localhost:4242'));