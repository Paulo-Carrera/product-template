// src/pages/Success.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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

  return (
    <div className="success-page">
      <h1>✅ Thank you for your order!</h1>
      <p><strong>Product:</strong> {order.product_name}</p>
      <p><strong>Email:</strong> {order.email || 'Not provided'}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Stripe Session ID:</strong> {order.stripe_session_id}</p>
      <a href="/">Back to home</a>
    </div>
  );
}