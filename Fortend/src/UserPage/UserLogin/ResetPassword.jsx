import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import './ResetPassword.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email) {
      setError('Email is missing. Please start the reset process again.');
      setLoading(false);
      return;
    }
    if (!otp) {
      setError('Please enter the OTP.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-reset-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify OTP');
      }
      setMessage(data.message || 'OTP verified successfully');
      setOtpVerified(true);
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword, confirmNewPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      setMessage(data.message || 'Password reset successfully');
      setOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setOtpVerified(false);
      setTimeout(() => navigate('/login', { replace: true }), 3000); // Redirect after 3 seconds
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const dismissError = () => {
    setError('');
  };

  return (
    <div className="reset-password__container">
      <div className="reset-password__card">
        <h1 className="reset-password__title">Reset Password</h1>
        <p className="reset-password__subtitle">
          {otpVerified
            ? `Enter your new password for ${email || 'your account'}.`
            : `Enter the OTP sent to ${email || 'your email'}.`}
        </p>
        {message && (
          <div className="reset-password__success" role="alert">
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="reset-password__error" role="alert">
            <FiAlertCircle className="reset-password__error-icon" />
            <span>{error}</span>
            <button
              className="reset-password__error-dismiss"
              onClick={dismissError}
              aria-label="Dismiss error message"
              title="Dismiss error"
            >
              ×
            </button>
          </div>
        )}
        {!otpVerified ? (
          <form onSubmit={handleVerifyOtp} className="reset-password__form">
            <div className="reset-password__form-group">
              <label htmlFor="otp" className="reset-password__form-label">
                OTP
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="reset-password__form-input"
                required
                autoComplete="off"
                aria-required="true"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="reset-password__submit-button"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <FiLoader className="reset-password__loading-spinner" /> Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="reset-password__form">
            <div className="reset-password__form-group">
              <label htmlFor="newPassword" className="reset-password__form-label">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="reset-password__form-input"
                required
                autoComplete="new-password"
                aria-required="true"
                minLength="8"
                disabled={loading}
              />
            </div>
            <div className="reset-password__form-group">
              <label htmlFor="confirmNewPassword" className="reset-password__form-label">
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="reset-password__form-input"
                required
                autoComplete="new-password"
                aria-required="true"
                minLength="8"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="reset-password__submit-button"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <FiLoader className="reset-password__loading-spinner" /> Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}
        <div className="reset-password__links">
          <p className="reset-password__login-link">
            Back to{' '}
            <button
              onClick={() => navigate('/login')}
              className="reset-password__link-text"
            >
              Log In
            </button>
          </p>
          <p className="reset-password__forgot-link">
            Didn't receive OTP?{' '}
            <button
              onClick={() => navigate('/forgot-password')}
              className="reset-password__link-text"
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;