import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Checkout from './pages/Checkout.jsx';
import CancelPage from './pages/CancelPage.jsx';
import Contact from './pages/Contact.jsx';
import Success from './pages/Success.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/cancel" element={<CancelPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}

export default App;