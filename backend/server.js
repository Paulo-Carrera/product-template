import 'dotenv/config';

import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';

import { getSupabaseClient } from './supabase/client.js';
import { insertOrder } from './supabase/insertOrder.js';
import contactRoute from './routes/contact.js';
import { sendConfirmationEmail } from './mailer/mailer.js';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = getSupabaseClient(); // ✅ Now safe to initialize

// Stripe requires raw body for webhook verification
app.use('/webhook', express.raw({ type: 'application/json' }));

// ✅ CORS setup — supports multiple origins via env
const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
      success_url: `${process.env.FRONTEND_URL.split(',')[0]}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL.split(',')[0]}/cancel`,
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
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('✅ Webhook received:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const sessionId = session.id;
    const email = session.customer_email || 'unknown';
    const product_name = session.metadata?.productName || 'unknown';

    const name = session.metadata?.shippingName;
    const address = {
      line1: session.metadata?.shippingAddressLine1,
      city: session.metadata?.shippingCity,
      state: session.metadata?.shippingState,
      postal_code: session.metadata?.shippingPostalCode,
    };

    console.log('🔍 Session ID:', sessionId);
    console.log('📦 Product:', product_name);
    console.log('📧 Email:', email);
    console.log('📬 Shipping name:', name);
    console.log('🏠 Shipping address:', address);

    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (fetchError) {
      console.error('❌ Supabase fetch error:', fetchError.message);
    }

    if (existingOrder) {
      const updatePayload = {
        status: 'completed',
        ...(email !== 'unknown' && !existingOrder.email && { email }),
        ...(product_name !== 'unknown' && !existingOrder.product_name && { product_name }),
        ...(name && { shipping_name: name }),
        ...(address.line1 && { shipping_address: JSON.stringify(address) }),
      };

      console.log('📝 Update payload:', updatePayload);

      const { error: updateError } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('stripe_session_id', sessionId);

      if (updateError) {
        console.error('❌ Supabase update error:', updateError.message);
      } else {
        console.log('✅ Order updated to completed');
      }

      if (email !== 'unknown') {
        try {
          await sendConfirmationEmail(email, product_name);
          console.log('📨 Confirmation email sent');
        } catch (err) {
          console.error('❌ Email send error:', err.message);
        }
      }
    } else {
      console.warn('⚠️ No matching order found for session:', sessionId);
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

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));