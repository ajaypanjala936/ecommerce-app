import React from 'react';
import './Shipping.css';

const Shipping = () => {
  return (
    <section className="shipping-section">
      <div className="shipping-container">
        <h2 className="shipping-title">Fast, Reliable Shipping with Express.com</h2>
        <p className="shipping-subtitle">
          Enjoy hassle-free delivery on all your orders, wherever you are.
        </p>
        <div className="shipping-features">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>Get free standard shipping on orders over $50. No code needed!</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Express Delivery</h3>
            <p>Need it fast? Choose express shipping for delivery in 1-2 days.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Worldwide Shipping</h3>
            <p>We ship to over 100 countries. Shop global, delivered local.</p>
          </div>
        </div>
        <div className="shipping-cta">
          <a href="/products" className="cta-button">
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default Shipping;