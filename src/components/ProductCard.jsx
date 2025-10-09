import React from 'react';

// import './ProductCard.css'; // Uncomment if you add styling

const ProductCard = ({ product }) => {
  const handleBuyClick = async () => {
    try {
      const res = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        console.error('No URL returned from Stripe');
      }
    } catch (err) {
      console.error('Error creating Stripe session:', err);
    }
  };

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
        className="product-image"
      />
      <h2 className="product-name">{product.name}</h2>
      <p className="product-description">{product.description}</p>
      <p className="product-price">{product.price}</p>
      <button className="buy-button" onClick={handleBuyClick}>
        Buy Now
      </button>
    </div>
  );
};

export default ProductCard;