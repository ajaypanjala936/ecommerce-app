




import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, user } = await login(email, password);
      console.log('Admin login successful, response:', {
        token: token?.slice(0, 10) + '...',
        user
      });
      console.log('localStorage after admin login:', {
        user: localStorage.getItem('user'),
        token: localStorage.getItem('token')?.slice(0, 10) + '...'
      });
      if (user.role !== 'admin') {
        throw new Error('You are not authorized as an admin');
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Admin login error:', err.message, err.stack);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login__container">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <h2 className="admin-login__title">Admin Portal</h2>
          <p className="admin-login__subtitle">Sign in to your admin account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-login__form-group">
            <label htmlFor="email" className="admin-login__form-label">Email Address</label>
            <input
              type="email"
              id="email"
              className="admin-login__form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Admin email"
              placeholder="admin@example.com"
            />
          </div>
          
          <div className="admin-login__form-group">
            <label htmlFor="password" className="admin-login__form-label">Password</label>
            <input
              type="password"
              id="password"
              className="admin-login__form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Admin password"
              placeholder="Enter your password"
            />
          </div>
          
          {error && <div className="admin-login__error">{error}</div>}
          
          <button 
            type="submit" 
            className="admin-login__submit-button" 
            disabled={loading}
          >
            {loading ? (
              <span className="admin-login__loader"></span>
            ) : 'Sign In'}
          </button>
        </form>
        
        <div className="admin-login__footer">
          <p className="admin-login__switch">
            Not an admin? <Link to="/login" className="admin-login__link-text">User Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;