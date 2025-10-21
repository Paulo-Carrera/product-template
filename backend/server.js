import { getSupabaseClient } from './supabase/client.js';
const supabase = getSupabaseClient();

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { insertOrder } from './supabase/insertOrder.js';
import contactRoute from './routes/contact.js';
import { sendConfirmationEmail } from './mailer/mailer.js';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe requires raw body for webhook verification
app.use('/webhook', express.raw({ type: 'application/json' }));

app.use(cors());
app.use(express.json());

// Contact form route
app.use('/contact', contactRoute);

// Stripe checkout route
app.post('/create-checkout-session', async (req, res) => {
  const {
    product,
    customerEmail,
    shippingName,
    shippingAddressLine1,
    shippingCity,
    shippingState,
    shippingPostalCode,
  } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
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
      metadata: {
        productName: product.name,
        shippingName,
        shippingAddressLine1,
        shippingCity,
        shippingState,
        shippingPostalCode,
      },
    });

    await insertOrder({
      product_name: product.name,
      status: 'initiated',
      email: customerEmail,
      stripe_session_id: session.id,
    });

    res.json({ url: session.url });
  } catch (err) {
    await insertOrder({
      product_name: product?.name || 'unknown',
      status: 'failed',
      email: customerEmail || 'unknown',
      stripe_session_id: 'none',
    });

    res.status(500).json({ error: err.message });
  }
});

// Stripe webhook — updates status and sends confirmation email
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
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;
  const email = session.customer_email || 'unknown';
  const product_name = session.metadata?.productName || 'unknown';

  const name = session.metadata?.shippingName;
  const address = {
    line1: session.metadata?.shippingAddressLine1,
    city: session.metadata?.shippingCity,
    state: session.metadata?.shippingState,
    postal_code: session.metadata?.shippingPostalCode,
  };

  const { data: existingOrder, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', session.id)
    .single();

  if (!fetchError && existingOrder) {
    const updatePayload = {
      status: event.type === 'checkout.session.completed' ? 'completed' : 'failed',
    };

    if (!existingOrder.email && email !== 'unknown') {
      updatePayload.email = email;
    }
    if (!existingOrder.product_name && product_name !== 'unknown') {
      updatePayload.product_name = product_name;
    }
    if (name) {
      updatePayload.shipping_name = name;
    }
    if (address.line1) {
      updatePayload.shipping_address = JSON.stringify(address);
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('stripe_session_id', session.id);

    if (!updateError && event.type === 'checkout.session.completed' && email !== 'unknown') {
      try {
        await sendConfirmationEmail(email, product_name);
      } catch (err) {
        console.error('Email send error:', err);
      }
    }
  }

  res.status(200).json({ received: true });
});

// Order details route for frontend success page
app.get('/order-details', async (req, res) => {
  const { session_id } = req.query;

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', session_id)
    .single();

  if (error || !data) {
    return res.status(500).json({ error: 'Order not found' });
  }

  res.json(data);
});

app.listen(4242, () => console.log('Backend running on http://localhost:4242'));