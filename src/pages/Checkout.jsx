import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header.jsx';

const Checkout = () => {
  const location = useLocation();
  const selectedProduct = location.state?.product || {
    name: 'Unknown Product',
    price: '',
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    product: selectedProduct.name,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Checkout submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div>
      <Header />
      <h1>Checkout</h1>

      {submitted ? (
        <p>✅ Thanks, {formData.name}! Your order for the {formData.product} has been received.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2rem auto' }}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
            />
          </label>

          <label>
            Product:
            <input
              type="text"
              name="product"
              value={formData.product}
              readOnly
              style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
            />
          </label>

          <button type="submit">Submit Order</button>
        </form>
      )}
    </div>
  );
};

export default Checkout;