


import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiAlertCircle, FiLoader, FiArrowLeft } from 'react-icons/fi'; // Added icons
import './Register.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const otpInputRef = useRef(null);

  // Auto-focus OTP input on step 2
  useEffect(() => {
    if (step === 2 && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    setApiError('');
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Mobile number must be 10 digits';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, formData);
      if (response.data.message === 'OTP sent to email') {
        setStep(2);
      } else {
        setApiError('Unexpected response from server');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setApiError('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await axios.post(`${API_BASE}/api/auth/verify-otp`, {
        email: formData.email,
        otp,
      });
      if (response.data.message === 'Account verified successfully') {
        alert('Registration successful! You can now login.');
        navigate('/login');
      } else {
        setApiError('Verification failed. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setApiError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setApiError('');
    setOtp('');

    try {
      const response = await axios.post(`${API_BASE}/api/auth/resend-otp`, {
        email: formData.email,
      });
      if (response.data.message === 'New OTP sent successfully') {
        alert('New OTP has been sent to your email');
      } else {
        setApiError('Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setApiError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const goBackToForm = () => {
    setStep(1);
    setOtp('');
    setApiError('');
    setErrors({});
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {step === 1 ? (
          <>
            <h1 className="register-title">Create Account</h1>
            {apiError && (
              <div className="api-error" role="alert">
                <FiAlertCircle className="error-icon" />
                <span>{apiError}</span>
                <button
                  className="error-dismiss"
                  onClick={() => setApiError('')}
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  aria-required="true"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className={`form-input ${errors.mobileNumber ? 'error' : ''}`}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  inputMode="numeric"
                  autoComplete="tel"
                  aria-required="true"
                />
                {errors.mobileNumber && <span className="error-message">{errors.mobileNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  autoComplete="email"
                  aria-required="true"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  placeholder="Enter your address"
                  rows="3"
                  autoComplete="street-address"
                  aria-required="true"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter password (min 6 characters)"
                  autoComplete="new-password"
                  aria-required="true"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  aria-required="true"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <button
                type="submit"
                className="register-button"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <FiLoader className="loading-spinner" /> Processing...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <p className="login-link">
              Already have an account? <Link to="/login" className="login-link-text">Login</Link>
            </p>
          </>
        ) : (
          <>
            <div className="otp-header">
              <button
                className="back-button"
                onClick={goBackToForm}
                aria-label="Back to registration form"
              >
                <FiArrowLeft /> Back
              </button>
              <h1 className="register-title">Verify Email</h1>
            </div>
            <p className="otp-instruction">
              We've sent a 6-digit OTP to your email: <strong>{formData.email}</strong>
            </p>

            {apiError && (
              <div className="api-error" role="alert">
                <FiAlertCircle className="error-icon" />
                <span>{apiError}</span>
                <button
                  className="error-dismiss"
                  onClick={() => setApiError('')}
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={verifyOtp} className="otp-form">
              <div className="form-group">
                <label htmlFor="otp" className="form-label">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  className={`form-input ${apiError ? 'error' : ''}`}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  ref={otpInputRef}
                  aria-required="true"
                />
                {apiError && <span className="error-message">{apiError}</span>}
              </div>

              <button
                type="submit"
                className="verify-button"
                disabled={loading || otp.length !== 6}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <FiLoader className="loading-spinner" /> Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </form>

            <p className="resend-otp">
              Didn't receive OTP?{' '}
              <button
                onClick={resendOtp}
                className="resend-button"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <FiLoader className="loading-spinner" /> Sending...
                  </>
                ) : (
                  'Resend OTP'
                )}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;