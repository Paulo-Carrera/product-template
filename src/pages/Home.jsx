import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import products from '../data/products.js';
import './Home.css';
import '../styles/global.css';

const Home = () => {
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    navigate('/checkout', { state: { product } });
  };

  // Round up to nearest X9.99 (e.g., 29.99, 39.99)
  const formatSalePrice = (price) => {
    const rounded = Math.ceil(price / 10) * 10;
    return (rounded - 0.01).toFixed(2);
  };

  return (
    <div>
      <main className="home-main">
        <h1 className="home-title">Featured Products</h1>
        <div className="product-grid">
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>
                <span className="price-original">${formatSalePrice(product.price * 2)}</span>{' '}
                <span className="price-sale">${formatSalePrice(product.price)}</span>
              </p>
              <button
                onClick={() => handleBuyNow(product)}
                className="buy-button"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;