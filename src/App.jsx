import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Checkout from './pages/Checkout.jsx';
import CancelPage from './pages/CancelPage.jsx';
import Contact from './pages/Contact.jsx';
import Success from './pages/Success.jsx';
import Shipping from './pages/Shipping.jsx';
import Refunds from './pages/Refunds.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import About from './pages/About.jsx';
import FAQ from './pages/FAQ.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/success" element={<Success />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/refunds" element={<Refunds />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;