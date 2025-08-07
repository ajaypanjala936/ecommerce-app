


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext'; // Adjust path as needed
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get authenticated user

  // Initialize formData with user details if logged in
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState(null);

  // Update formData if user changes (e.g., logs in/out during component lifecycle)
  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      message: '',
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?._id || null, // Include userId if logged in
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
      setFormStatus('success');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        message: '',
      }); // Reset form, preserving user details
      setTimeout(() => setFormStatus(null), 3000); // Clear status after 3s
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 3000); // Clear status after 3s
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1 className="contact-title1">Contact Us</h1>
        <p className="contact-subtitle">
          We're here to help! Reach out with any questions or feedback.
        </p>
      </header>

      <main className="contact-content">
        <section className="contact-form-section">
          <h2 className="section-title">Send Us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contact-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contact-form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Your message here..."
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>
            {formStatus === 'success' && (
              <div className="contact-form-message contact-success">
                Message sent successfully!
              </div>
            )}
            {formStatus === 'error' && (
              <div className="contact-form-message contact-error">
                Failed to send message. Please try again.
              </div>
            )}
            <button type="submit" className="contact-submit-btn">
              Send Message
            </button>
          </form>
        </section>

        <section className="contact-info">
          <h2 className="section-title">Contact Information</h2>
          <div className="contact-info-item">
            <FaEnvelope className="contact-icon" />
            <p>
              <strong>Email:</strong> support@ourstore.com
            </p>
          </div>
          <div className="contact-info-item">
            <FaPhone className="contact-icon" />
            <p>
              <strong>Phone:</strong> +1 (123) 456-7890
            </p>
          </div>
          <div className="contact-info-item">
            <FaMapMarkerAlt className="contact-icon" />
            <p>
              <strong>Address:</strong> 123 Main St, City, Country
            </p>
          </div>
        </section>
      </main>

      <button
        className="back-home-btn"
        onClick={handleBackToHome}
        aria-label="Back to home"
      >
        <FaHome className="btn-icon" /> Back to Home
      </button>
    </div>
  );
};

export default Contact;