import React from 'react';
import './ProductCard.css';
import '../styles/global.css';

const ProductCard = ({ product }) => {
  const handleBuyClick = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      console.log('API base:', import.meta.env.VITE_API_BASE_URL);

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No URL returned from Stripe');
      }
    } catch (err) {
      console.error('Error creating Stripe session:', err);
    }
  };

  // Sale logic: x2 + 1 if < $50, x1.5 + 1 if ≥ $50, then round down to nearest 10 and subtract 0.01
  const markup = product.price < 50 ? 2 : 1.5;
  const raw = product.price * markup + 1;
  const originalPrice = `${Math.floor(raw / 10) * 10 - 0.01}`;

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
      />
      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-description">{product.description}</p>
        <div className="price-group">
          <span className="original-price">${originalPrice}</span>
          <span className="product-price">${product.price.toFixed(2)}</span>
        </div>
        <button className="buy-button" onClick={handleBuyClick}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;