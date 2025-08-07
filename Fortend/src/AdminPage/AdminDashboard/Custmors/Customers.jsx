

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Customers.css';

const Customers = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState({ totalUsers: 0, verifiedUsers: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!user || !token || user.role !== 'admin') {
      setError('You must be an admin to view customer data');
      setLoading(false);
      navigate('/admin-login');
    }
  }, [user, token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !token || user.role !== 'admin') return;

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching data with token:', token.substring(0, 10) + '...');

        // Fetch user count
        const countResponse = await fetch('http://localhost:5000/api/auth/user-count', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!countResponse.ok) {
          const errorData = await countResponse.json();
          if (countResponse.status === 401) {
            throw new Error('Unauthorized: Please log in again');
          }
          throw new Error(errorData.message || 'Failed to fetch user count');
        }
        const countData = await countResponse.json();
        setUserCount(countData);

        // Fetch user details
        const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!usersResponse.ok) {
          const errorData = await usersResponse.json();
          if (usersResponse.status === 401) {
            throw new Error('Unauthorized: Please log in again');
          }
          throw new Error(errorData.message || 'Failed to fetch users');
        }
        const usersData = await usersResponse.json();
        console.log('Fetched users:', usersData.map(u => ({ email: u.email, mobileNumber: u.mobileNumber, address: u.address })));
        const formattedUsers = usersData.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber || 'N/A',
          address: user.address || 'N/A',
          role: user.role,
          isVerified: user.isVerified ? 'Yes' : 'No',
          createdAt: new Date(user.createdAt).toLocaleDateString(),
        }));
        setUsers(formattedUsers);
      } catch (err) {
        console.error('Fetch data error:', err.message);
        setError(err.message);
        if (err.message.includes('Unauthorized')) {
          navigate('/admin-login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && token && user.role === 'admin') {
      fetchData();
    }
  }, [user, token, navigate]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter(user => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.mobileNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.address || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (!user || !token) return null;

  return (
    <div className="customers-container">
      <h2>Customers</h2>
      {loading ? (
        <p>Loading customer data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="customer-stats">
            <div className="stat-card1">
              <h3>Total Registered Users</h3>
              <p>{userCount.totalUsers}</p>
            </div>
            <div className="stat-card1">
              <h3>Verified Users</h3>
              <p>{userCount.verifiedUsers}</p>
            </div>
          </div>

          <div className="customers-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span>🔍</span>
            </div>
          </div>

          <div className="customers-table-container">
            <table className="customers-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>
                    ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('name')}>
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('email')}>
                    Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('mobileNumber')}>
                    Mobile Number {sortConfig.key === 'mobileNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('address')}>
                    Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('role')}>
                    Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('isVerified')}>
                    Verified {sortConfig.key === 'isVerified' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('createdAt')}>
                    Joined {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobileNumber}</td>
                      <td>{user.address}</td>
                      <td>{user.role}</td>
                      <td>{user.isVerified}</td>
                      <td>{user.createdAt}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-users">
                      No users found. Try adjusting the search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Customers;