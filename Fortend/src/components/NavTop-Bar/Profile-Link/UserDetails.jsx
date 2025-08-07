



import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './UserDetails.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const UserDetails = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sync formData with user
  useEffect(() => {
    console.log('User from useAuth:', user);
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/user`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log('Update user response:', {
        status: response.status,
        contentType: response.headers.get('content-type')
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          response.status === 404
            ? 'User update API not found. Please check server configuration.'
            : `Failed to update profile: ${response.status} - ${text.slice(0, 50)}...`
        );
      }
      if (!response.headers.get('content-type')?.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, received: ${text.slice(0, 50)}...`);
      }
      const updatedUser = await response.json();
      setSuccess(updatedUser.message);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        name: updatedUser.user.name,
        email: updatedUser.user.email,
        mobileNumber: updatedUser.user.mobileNumber,
        address: updatedUser.user.address
      }));
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
      console.error('Update user error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    setIsPasswordLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/user/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });
      console.log('Change password response:', {
        status: response.status,
        contentType: response.headers.get('content-type')
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          response.status === 404
            ? 'Change password API not found. Please check server configuration.'
            : `Failed to change password: ${response.status} - ${text.slice(0, 50)}...`
        );
      }
      if (!response.headers.get('content-type')?.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, received: ${text.slice(0, 50)}...`);
      }
      const result = await response.json();
      setPasswordSuccess(result.message);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setIsChangingPassword(false);
    } catch (err) {
      setPasswordError(err.message);
      console.error('Change password error:', err.message);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (!user) {
    return <div className="user-details-container">Please log in to view your details.</div>;
  }

  return (
    <div className="user-details-container">
      <h2>User Details</h2>
      {!isEditing && !isChangingPassword ? (
        <div className="user-details-view">
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className={`detail-value ${!formData.name ? 'not-provided' : ''}`}>
              {formData.name || 'Not provided'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className={`detail-value ${!formData.email ? 'not-provided' : ''}`}>
              {formData.email || 'Not provided'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Mobile Number:</span>
            <span className={`detail-value ${!formData.mobileNumber ? 'not-provided' : ''}`}>
              {formData.mobileNumber || 'Not provided'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Address:</span>
            <span className={`detail-value ${!formData.address ? 'not-provided' : ''}`}>
              {formData.address || 'Not provided'}
            </span>
          </div>
          <div className="button-group">
            <button
              className="action-button edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="action-button password-button"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      ) : isEditing ? (
        <form onSubmit={handleSubmit} className="user-details-form">
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="form-group06">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group06">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group06">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              pattern="\d{10,12}"
              title="Mobile number must be 10-12 digits"
              disabled={isLoading}
            />
          </div>
          <div className="form-group06">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-actions06">
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="user-details-form password-form">
          {passwordError && <p className="error-message">{passwordError}</p>}
          {passwordSuccess && <p className="success-message">{passwordSuccess}</p>}
          <div className="form-group06">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              disabled={isPasswordLoading}
            />
          </div>
          <div className="form-group06">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={8}
              disabled={isPasswordLoading}
            />
          </div>
          <div className="form-group06">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              required
              minLength={8}
              disabled={isPasswordLoading}
            />
          </div>
          <div className="form-actions06">
            <button type="submit" className="submit-button" disabled={isPasswordLoading}>
              {isPasswordLoading ? 'Changing...' : 'Change Password'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsChangingPassword(false)}
              disabled={isPasswordLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserDetails;