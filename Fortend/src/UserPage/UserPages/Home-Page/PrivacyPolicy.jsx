import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      <p>
        Welcome to our e-commerce platform. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this policy carefully. If you do not agree with the terms, please do not use our services.
      </p>

      <section>
        <h2>1. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> When you create an account, place an order, or contact us, we collect details such as your name, email address, phone number, billing and shipping address, and payment information.
          </li>
          <li>
            <strong>Cart and Order Data:</strong> Information about products you add to your cart, purchase history, and order preferences, stored locally in your browser or on our servers.
          </li>
          <li>
            <strong>Usage Data:</strong> Details about your interactions with our website, such as pages visited, products viewed, and time spent, collected via cookies and similar technologies.
          </li>
          <li>
            <strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers to enhance security and functionality.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Process and fulfill your orders, including sending order confirmations and updates.</li>
          <li>Manage your account and provide personalized shopping experiences.</li>
          <li>Improve our website, products, and services based on usage patterns.</li>
          <li>Communicate with you, including responding to inquiries and sending promotional offers (with your consent).</li>
          <li>Prevent fraud, enhance security, and comply with legal obligations.</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Share Your Information</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>
            <strong>Service Providers:</strong> Third parties that assist with payment processing, shipping, email delivery, and analytics (e.g., payment gateways, logistics partners).
          </li>
          <li>
            <strong>Legal Authorities:</strong> When required by law or to protect our rights, safety, or property.
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new entity.
          </li>
        </ul>
        <p>We do not sell your personal information to third parties for marketing purposes.</p>
      </section>

      <section>
        <h2>4. Data Storage and Security</h2>
        <p>
          Your data is stored securely on our servers and protected using industry-standard measures, including encryption and access controls. Cart data is stored locally in your browser’s localStorage for convenience. However, no system is completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>5. Your Rights</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of your personal data.</li>
          <li><strong>Correction:</strong> Update inaccurate or incomplete data.</li>
          <li><strong>Deletion:</strong> Request deletion of your data, subject to legal obligations.</li>
          <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications or opt-out of certain data processing.</li>
          <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
        </ul>
        <p>
          To exercise these rights, contact us at <a href="mailto:support@ecommerce.com">support@ecommerce.com</a>.
        </p>
      </section>

      <section>
        <h2>6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can manage cookie preferences through your browser settings. Essential cookies are required for website functionality and cannot be disabled.
        </p>
      </section>

      <section>
        <h2>7. Third-Party Services</h2>
        <p>
          Our website may integrate third-party services (e.g., payment processors, analytics tools) that have their own privacy policies. We are not responsible for their practices. Please review their policies before using their services.
        </p>
      </section>

      <section>
        <h2>8. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes in our practices or legal requirements. Updates will be posted on this page, and we will notify you of significant changes via email or website notifications. This policy was last updated on April 24, 2025.
        </p>
      </section>

      <section>
        <h2>9. Contact Us</h2>
        <p>
          If you have questions or concerns about this Privacy Policy, please contact us at:
          <br />
          Email: <a href="mailto:support@ecommerce.com">support@ecommerce.com</a>
          <br />
          Address: 123 E-Commerce Lane, Privacy City, PC 12345
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;