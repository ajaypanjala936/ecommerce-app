import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import './Forgot.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      setMessage(data.message || 'OTP sent to your email');
      setEmail('');
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000); // Navigate after 2 seconds to show message
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const dismissError = () => {
    setError('');
  };

  return (
    <div className="forgot__container">
      <div className="forgot__card">
        <h1 className="forgot__title">Forgot Password</h1>
        <p className="forgot__subtitle">Enter your email address to receive a password reset OTP.</p>
        {message && (
          <div className="forgot__success" role="alert">
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="forgot__error" role="alert">
            <FiAlertCircle className="forgot__error-icon" />
            <span>{error}</span>
            <button
              className="forgot__error-dismiss"
              onClick={dismissError}
              aria-label="Dismiss error message"
              title="Dismiss error"
            >
              ×
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="forgot__form">
          <div className="forgot__form-group">
            <label htmlFor="email" className="forgot__form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="forgot__form-input"
              disabled={loading}
              autoComplete="email"
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            className="forgot__submit-button"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <FiLoader className="forgot__loading-spinner" /> Sending OTP...
              </>
            ) : (
              'Send OTP'
            )}
          </button>
        </form>
        <div className="forgot__links">
          <p className="forgot__login-link">
            Remember your password?{' '}
            <button
              onClick={() => navigate('/login')}
              className="forgot__link-text"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forgot;