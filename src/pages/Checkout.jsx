import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header.jsx';
import products from '../data/products.js';

const Checkout = () => {
  const location = useLocation();
  const initialProduct = location.state?.product || null;

  const [selectedProductId, setSelectedProductId] = useState(initialProduct?.id || '');
  const selectedProduct = products.find(p => p.id === parseInt(selectedProductId)) || initialProduct;

  useEffect(() => {
    // Optional: log selected product
    if (selectedProduct) {
      console.log('Selected product:', selectedProduct.name);
    }
  }, [selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           product: selectedProduct,
           customerEmail: e.target.email.value 
          }),
      });

      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      console.error('Stripe checkout error:', err);
    }
  };

  return (
    <div>
      <Header />
      <h1 style={{ textAlign: 'center' }}>Checkout</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <label>
          Product:
          <select
            name="product"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
          >
            <option value="">-- Select a product --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (${product.price})
              </option>
            ))}
          </select>
        </label>

        {selectedProduct && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              style={{ width: '200px', borderRadius: '8px' }}
            />
            <p>{selectedProduct.description}</p>
          </div>
        )}

        <label>
  Email:
  <input
    type="email"
    name="email"
    required
    placeholder="you@example.com"
    style={{
      display: 'block',
      width: '100%',
      marginBottom: '1rem',
      padding: '0.5rem',
      borderRadius: '6px',
      border: '1px solid #ccc',
    }}
  />
</label>

        <button
          type="submit"
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
          disabled={!selectedProduct}
        >
          Buy Now
        </button>
      </form>
    </div>
  );
};

export default Checkout;