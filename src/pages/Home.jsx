import React from 'react';
import Header from '../components/Header.jsx';
import ProductCard from '../components/ProductCard.jsx';
import products from '../data/products.js';
import './Home.css';
import '../styles/global.css';

const Home = () => {
  return (
    <div>
      <Header />
      <main style={{ padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Featured Products</h1>
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;