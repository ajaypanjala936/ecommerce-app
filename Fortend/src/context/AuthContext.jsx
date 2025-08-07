




import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user and token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    console.log('AuthContext init:', {
      storedUser,
      storedToken: storedToken?.slice(0, 10) + '...'
    });
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.id || !parsedUser.email || !parsedUser.role) {
          throw new Error('Invalid user data in localStorage');
        }
        setUser(parsedUser);
        setToken(storedToken);
        console.log('AuthContext loaded user:', {
          id: parsedUser.id,
          email: parsedUser.email,
          role: parsedUser.role
        });
      } catch (err) {
        console.error('Error parsing stored user:', err.message);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      console.log('No user or token in localStorage');
    }
  }, []);

  // Fetch user data on mount if token exists
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/check-auth`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('check-auth response:', {
          status: response.status,
          contentType: response.headers.get('content-type')
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch user data: ${response.status} - ${text.slice(0, 50)}...`);
        }
        if (!response.headers.get('content-type')?.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON, received: ${text.slice(0, 50)}...`);
        }
        const data = await response.json();
        const userData = {
          id: data.user.id || data.user._id,
          name: data.user.name,
          email: data.user.email,
          mobileNumber: data.user.mobileNumber,
          address: data.user.address,
          role: data.user.role
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('AuthContext fetched user:', userData);
      } catch (err) {
        console.error('Error fetching user data:', err.message);
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    };

    if (token && !user) {
      fetchUserData();
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      console.log('login response:', {
        status: response.status,
        contentType: response.headers.get('content-type')
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Login failed: ${response.status} - ${text.slice(0, 50)}...`);
      }
      if (!response.headers.get('content-type')?.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, received: ${text.slice(0, 50)}...`);
      }
      const data = await response.json();
      console.log('Login response data:', {
        token: data.token?.slice(0, 10) + '...',
        user: data.user
      });
      const userData = {
        id: data.user.id || data.user._id,
        email: data.user.email,
        name: data.user.name,
        mobileNumber: data.user.mobileNumber,
        address: data.user.address,
        role: data.user.role
      };
      setUser(userData);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      console.log('Stored in localStorage:', {
        user: userData,
        token: data.token.slice(0, 10) + '...'
      });
      return { user: userData, token: data.token };
    } catch (err) {
      console.error('Login error:', err.message);
      throw err;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/refresh`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('refresh response:', {
        status: response.status,
        contentType: response.headers.get('content-type')
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to refresh token: ${response.status} - ${text.slice(0, 50)}...`);
      }
      if (!response.headers.get('content-type')?.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, received: ${text.slice(0, 50)}...`);
      }
      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);
      console.log('Token refreshed:', data.token.slice(0, 10) + '...');
      return data.token;
    } catch (err) {
      console.error('Token refresh error:', err.message);
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('Logged out, cleared localStorage');
  };

  const value = {
    user: user ? { ...user, token } : null,
    token,
    login,
    logout,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };










