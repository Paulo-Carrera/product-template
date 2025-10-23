// src/components/Footer.jsx
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h4>Customer Support</h4>
        <ul>
          <li><a href="/contact">Contact Us</a></li>
          <li><a href="/shipping">Shipping Info</a></li>
          <li><a href="/refunds">Refund Policy</a></li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Trust & Security</h4>
        <ul>
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li>Secure checkout via Stripe 🔒</li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>About</h4>
        <ul>
          <li><a href="/about">Our Story</a></li>
          <li><a href="/faq">FAQ</a></li>
        </ul>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Product Pulse. All rights reserved.</p>
      </div>
    </footer>
  );
}
