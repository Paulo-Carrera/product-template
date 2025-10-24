// src/pages/Success.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Success.css';

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      const res = await fetch(`http://localhost:4242/order-details?session_id=${sessionId}`);
      const data = await res.json();
      setOrder(data);
    }

    if (sessionId) fetchOrder();
  }, [sessionId]);

  if (!order) return <p>Loading order details...</p>;

  const formattedDate = order.timestamp
  ? new Date(order.timestamp).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  : 'Not available';

  return (
    <div className="success-page">
      <h1>Product Pulse</h1>
      <h2>✅ Thank you for your order!</h2>
      <p><strong>Date:</strong> {formattedDate}</p>
      <p><strong>Product:</strong> {order.product_name}</p>
      <p><strong>Email:</strong> {order.email || 'Not provided'}</p>
      <p><strong>Status:</strong> {order.status}</p>
      {/* <p><strong>Stripe Session ID:</strong> {order.stripe_session_id}</p> */}
      <p><strong>Shipping to:</strong> {order.shipping_name}</p>

      {order.shipping_address && (() => {
        const address = typeof order.shipping_address === 'string'
          ? JSON.parse(order.shipping_address)
          : order.shipping_address;

        return (
          <p>
            <strong>Address:</strong> {address.line1}, {address.city}, {address.state} {address.postal_code}
          </p>
        );
      })()}

      <p><small><strong>Check email for confirmation.</strong></small></p>
      <a href="/">Back to home</a>
    </div>
  );
}