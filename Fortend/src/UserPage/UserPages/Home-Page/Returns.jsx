import React from 'react';
import './Returns.css';

const Returns = () => {
  return (
    <section className="returns-section">
      <div className="returns-container">
        <h2 className="returns-title">Hassle-Free Returns with Express.com</h2>
        <p className="returns-subtitle">
          Shop with confidence knowing returns are simple and stress-free.
        </p>
        <div className="returns-features">
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>30-Day Returns</h3>
            <p>Return items within 30 days for a full refund, no questions asked.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Free Return Shipping</h3>
            <p>We cover return shipping costs for eligible orders.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💸</div>
            <h3>Easy Refunds</h3>
            <p>Get your refund processed quickly to your original payment method.</p>
          </div>
        </div>
        <div className="returns-cta">
          <a href="/returns-policy" className="cta-button">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Returns;