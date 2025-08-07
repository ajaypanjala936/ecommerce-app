import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminSettings.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const AdminSettings = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState({
    storeName: '',
    logoUrl: '',
    contactEmail: '',
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    emailUser: '',
    emailPass: '',
  });

  // Promo Code State
  const [promoCodes, setPromoCodes] = useState([]);
  const [newPromo, setNewPromo] = useState({
    code: '',
    type: 'percentage',
    value: '',
    label: '',
  });

  // Password State
  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Redirect non-admins
  useEffect(() => {
    if (!user || !token || user.role !== 'admin') {
      setError('Unauthorized: Admins only');
      navigate('/admin/login');
    }
  }, [user, token, navigate]);

  // Fetch current settings (optional, if backend supports GET /api/settings)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSiteSettings({
          storeName: data.storeName || '',
          logoUrl: data.logoUrl || '',
          contactEmail: data.contactEmail || '',
        });
        setEmailSettings({
          emailUser: data.emailUser || '',
          emailPass: '', // Password not returned for security
        });
        setPromoCodes(data.promoCodes || []);
      } catch (err) {
        console.error('Fetch settings error:', err.message);
        setError('Failed to load settings');
      }
    };
    if (user && token && user.role === 'admin') {
      fetchSettings();
    }
  }, [user, token]);

  // Handle Site Settings Update
  const handleSiteSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/settings/site`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(siteSettings),
      });
      if (!response.ok) throw new Error('Failed to update site settings');
      setSuccess('Site settings updated successfully');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  // Handle Email Settings Update
  const handleEmailSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/settings/email`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emailSettings),
      });
      if (!response.ok) throw new Error('Failed to update email settings');
      setSuccess('Email settings updated successfully');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  // Handle Add Promo Code
  const handleAddPromo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/settings/promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPromo),
      });
      if (!response.ok) throw new Error('Failed to add promo code');
      const addedPromo = await response.json();
      setPromoCodes([...promoCodes, addedPromo]);
      setNewPromo({ code: '', type: 'percentage', value: '', label: '' });
      setSuccess('Promo code added successfully');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  // Handle Delete Promo Code
  const handleDeletePromo = async (code) => {
    if (!window.confirm(`Delete promo code ${code}?`)) return;
    try {
      const response = await fetch(`${API_BASE}/api/settings/promo/${code}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete promo code');
      setPromoCodes(promoCodes.filter((promo) => promo.code !== code));
      setSuccess('Promo code deleted successfully');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      setError('New passwords do not match');
      setSuccess('');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/auth/admin/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordSettings.currentPassword,
          newPassword: passwordSettings.newPassword,
        }),
      });
      if (!response.ok) throw new Error('Failed to update password');
      setSuccess('Password updated successfully');
      setError('');
      setPasswordSettings({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="admin-settings-container">
      <h2>Admin Settings</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* Site Settings */}
      <section className="settings-section">
        <h3>Site Settings</h3>
        <form onSubmit={handleSiteSettingsSubmit}>
          <div className="form-group">
            <label htmlFor="storeName">Store Name</label>
            <input
              id="storeName"
              type="text"
              value={siteSettings.storeName}
              onChange={(e) => setSiteSettings({ ...siteSettings, storeName: e.target.value })}
              placeholder="Express.Com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="logoUrl">Logo URL</label>
            <input
              id="logoUrl"
              type="url"
              value={siteSettings.logoUrl}
              onChange={(e) => setSiteSettings({ ...siteSettings, logoUrl: e.target.value })}
              placeholder="http://example.com/logo.png"
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactEmail">Contact Email</label>
            <input
              id="contactEmail"
              type="email"
              value={siteSettings.contactEmail}
              onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
              placeholder="support@example.com"
              required
            />
          </div>
          <button type="submit" className="submit-btn">Save Site Settings</button>
        </form>
      </section>

      {/* Email Settings */}
      <section className="settings-section">
        <h3>Email Settings</h3>
        <form onSubmit={handleEmailSettingsSubmit}>
          <div className="form-group">
            <label htmlFor="emailUser">Email Address</label>
            <input
              id="emailUser"
              type="email"
              value={emailSettings.emailUser}
              onChange={(e) => setEmailSettings({ ...emailSettings, emailUser: e.target.value })}
              placeholder="yourstore@gmail.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="emailPass">Email Password</label>
            <input
              id="emailPass"
              type="password"
              value={emailSettings.emailPass}
              onChange={(e) => setEmailSettings({ ...emailSettings, emailPass: e.target.value })}
              placeholder="App-specific password"
            />
          </div>
          <button type="submit" className="submit-btn">Save Email Settings</button>
        </form>
      </section>

      {/* Promo Codes */}
      <section className="settings-section">
        <h3>Promo Codes</h3>
        <form onSubmit={handleAddPromo}>
          <div className="form-group">
            <label htmlFor="promoCode">Code</label>
            <input
              id="promoCode"
              type="text"
              value={newPromo.code}
              onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
              placeholder="SAVE10"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="promoType">Type</label>
            <select
              id="promoType"
              value={newPromo.type}
              onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="promoValue">Value</label>
            <input
              id="promoValue"
              type="number"
              value={newPromo.value}
              onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })}
              placeholder={newPromo.type === 'percentage' ? '10' : '50'}
              min="0"
              step={newPromo.type === 'percentage' ? '1' : '0.01'}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="promoLabel">Label</label>
            <input
              id="promoLabel"
              type="text"
              value={newPromo.label}
              onChange={(e) => setNewPromo({ ...newPromo, label: e.target.value })}
              placeholder="10% Off"
              required
            />
          </div>
          <button type="submit" className="submit-btn">Add Promo Code</button>
        </form>
        <div className="promo-list">
          <h4>Existing Promo Codes</h4>
          {promoCodes.length === 0 ? (
            <p>No promo codes found.</p>
          ) : (
            <ul>
              {promoCodes.map((promo) => (
                <li key={promo.code} className="promo-item">
                  <span>{promo.code} ({promo.label}) - {promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value}`}</span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeletePromo(promo.code)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Password Update */}
      <section className="settings-section">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              value={passwordSettings.currentPassword}
              onChange={(e) => setPasswordSettings({ ...passwordSettings, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={passwordSettings.newPassword}
              onChange={(e) => setPasswordSettings({ ...passwordSettings, newPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={passwordSettings.confirmPassword}
              onChange={(e) => setPasswordSettings({ ...passwordSettings, confirmPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Update Password</button>
        </form>
      </section>
    </div>
  );
};

export default AdminSettings;