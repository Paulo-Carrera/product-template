import React from 'react';
// import './Header.css'; // styling (optional)

const Header = () => {
    return (
        <header className="site-header">
            <div className="logo">ProductPulse</div>
            <nav className="nav-links">
                <a href="/">Home</a>
                <a href="/checkout">Checkout</a>
                <a href="/contact">Contact</a>
            </nav>
        </header>
    );
};

export default Header;