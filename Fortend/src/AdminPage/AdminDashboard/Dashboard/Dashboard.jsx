




import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Orders from '../Orders/Orders';
import AdminProducts from '../Products/AdminProducts';
import Sales from '../Sales/Sales';
import Customers from '../Custmors/Customers';
import AdminSettings from '../Settings/AdminSettings';

import AdminChat from '../Chat/Chats/AdminChat';
import './Dashboard.css';
import OrderDetailsModal from '../Orders/OrderDetailsModal';

// Icons
const DashboardIcon = () => <span>📊</span>;
const OrdersIcon = () => <span>📦</span>;
const ProductsIcon = () => <span>🛍️</span>;
const CustomersIcon = () => <span>👥</span>;
const SalesIcon = () => <span>💰</span>;
const SettingsIcon = () => <span>⚙️</span>;
const ChatsIcon = () => <span>💬</span>;

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('Dashboard accessed, user:', {
      id: user?.id,
      email: user?.email,
      role: user?.role,
      token: token?.slice(0, 10) + '...',
      localStorageUser: localStorage.getItem('user'),
      localStorageToken: localStorage.getItem('token')?.slice(0, 10) + '...'
    });
    if (!user || !token || user.role !== 'admin') {
      console.log('Redirecting to admin login: Invalid user or not admin');
      navigate('/login', { replace: true });
    }
  }, [user, token, navigate]);

  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/refresh`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      console.log('Token refreshed:', data.token.slice(0, 10) + '...');
      return data.token;
    } catch (err) {
      console.error('Token refresh error:', err.message);
      setError('Session expired. Please log in again.');
      navigate('/login', { replace: true });
      return null;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !user || user.role !== 'admin') return;

      try {
        setLoading(true);
        setError(null);

        // Fetch user count
        let userCountResponse = await fetch(`${API_BASE}/api/auth/user-count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (userCountResponse.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            userCountResponse = await fetch(`${API_BASE}/api/auth/user-count`, {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            });
          }
        }
        if (!userCountResponse.ok) {
          const errorData = await userCountResponse.json();
          throw new Error(errorData.message || 'Failed to fetch user count');
        }
        const userCountData = await userCountResponse.json();

        // Fetch orders
        let ordersResponse = await fetch(`${API_BASE}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (ordersResponse.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            ordersResponse = await fetch(`${API_BASE}/api/orders`, {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            });
          }
        }
        if (!ordersResponse.ok) {
          const errorData = await ordersResponse.json();
          throw new Error(errorData.error || 'Failed to fetch orders');
        }
        const ordersData = await ordersResponse.json();

        // Format and limit to 5 recent orders
        const formattedOrders = ordersData
          .map(order => {
            // Fallback: Calculate amount from items if totalAmount is 0 or undefined
            let amount = order.totals?.totalAmount || 0;
            if (amount === 0 && order.items?.length > 0) {
              amount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              console.warn(`Order ${order._id} has zero totalAmount, calculated from items: ${amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`);
            }
            return {
              id: order._id,
              customer: order.shipping.name,
              date: new Date(order.createdAt).toLocaleDateString(),
              amount,
              status: order.status,
            };
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setRecentOrders(formattedOrders);

        // Calculate totalSales with fallback amounts
        const totalSales = ordersData.reduce((sum, order) => {
          let amount = order.totals?.totalAmount || 0;
          if (amount === 0 && order.items?.length > 0) {
            amount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          }
          return sum + amount;
        }, 0);

        // Fetch products
        let productsResponse = await fetch(`${API_BASE}/api/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (productsResponse.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            productsResponse = await fetch(`${API_BASE}/api/products`, {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            });
          }
        }
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();

        // Format and limit to 5 recent products
        const formattedProducts = productsData
          .map(product => ({
            id: product._id,
            name: product.name,
            category: product.category || 'N/A',
            price: product.price,
            stock: product.stock || 0,
          }))
          .sort((a, b) => b.id.localeCompare(a.id))
          .slice(0, 5);
        setRecentProducts(formattedProducts);

        // Update stats
        setStats({
          totalSales,
          totalOrders: ordersData.length,
          totalProducts: productsData.length,
          totalUsers: userCountData.totalUsers,
        });
      } catch (err) {
        console.error('Fetch dashboard data error:', err);
        setError(err.message);
        if (err.message.includes('Unauthorized')) {
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && token && user.role === 'admin') {
      fetchDashboardData();
    }
  }, [user, token, navigate]);

  const handleViewOrder = async (orderId) => {
    try {
      let response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
        }
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch order details');
      }
      const order = await response.json();
      // Fallback: Calculate totalAmount for modal if zero
      if (!order.totals?.totalAmount && order.items?.length > 0) {
        order.totals = {
          ...order.totals,
          totalAmount: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };
        console.warn(`Order ${order._id} modal has zero totalAmount, calculated from items: ${order.totals.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`);
      }
      setSelectedOrder(order);
      setShowModal(true);
    } catch (err) {
      console.error('Fetch order details error:', err);
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'processing': return 'status-processing';
      case 'cancelled': return 'status-cancelled';
      case 'pending': return 'status-pending';
      default: return 'status-default';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersTab />;
      case 'products':
        return <ProductsTab />;
      case 'customers':
        return <CustomersTab />;
      case 'sales':
        return <SalesTab />;
      case 'settings':
        return <SettingsTab />;
      case 'chats':
        return <ChatsTab />;
      default:
        return (
          <div className="dashboard-content">
            <h2>Overview</h2>
            {loading ? (
              <div className="loading">Loading dashboard data...</div>
            ) : error ? (
              <div className="error">Error: {error}</div>
            ) : (
              <>
                <div className="stats-grid">
                  <StatCard 
                    title="Total Sales" 
                    value={stats.totalSales.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} 
                    change="+12.5% from last month" 
                    icon={<SalesIcon />}
                  />
                  <StatCard 
                    title="Total Orders" 
                    value={stats.totalOrders} 
                    change="+8.2% from last month" 
                    icon={<OrdersIcon />}
                  />
                  <StatCard 
                    title="Products" 
                    value={stats.totalProducts} 
                    change="3 new this week" 
                    icon={<ProductsIcon />}
                  />
                  <StatCard 
                    title="Total Customers" 
                    value={stats.totalUsers} 
                    change="Click Customers tab for details" 
                    icon={<CustomersIcon />}
                  />
                </div>
                <div className="recent-orders">
                  <h3>Recent Orders</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length > 0 ? (
                        recentOrders.map(order => (
                          <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.date}</td>
                            <td>{order.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                            <td>
                              <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="view-btn"
                                onClick={() => handleViewOrder(order.id)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="no-orders">No recent orders</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="recent-products">
                  <h3>Recent Products</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProducts.length > 0 ? (
                        recentProducts.map(product => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                            <td className={product.stock < 50 ? 'low-stock' : ''}>{product.stock}</td>
                            <td>
                              <Link to={`/products/${product.id}`} className="view-btn">View</Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="no-products">No recent products</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  if (!user || !token || user.role !== 'admin') return null;

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className='ecom-head'>E-Commerce Admin</h2>
          <p>Welcome back, {user?.name || 'Admin'}!</p>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            aria-label="Dashboard"
          >
            <DashboardIcon /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            aria-label="Orders"
          >
            <OrdersIcon /> Orders
          </button>
          <button 
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
            aria-label="Products"
          >
            <ProductsIcon /> Products
          </button>
          <button 
            className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
            aria-label="Customers"
          >
            <CustomersIcon /> Customers
          </button>
          <button 
            className={`nav-item ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
            aria-label="Sales"
          >
            <SalesIcon /> Sales
          </button>
          <button 
            className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
            aria-label="Chat Support"
          >
            <ChatsIcon /> Chat Support
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            aria-label="Settings"
          >
            <SettingsIcon /> Settings
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn" aria-label="Logout">
            Logout
          </button>
        </div>
      </div>
      
      <div className="main-content">
        <header className="dashboard-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="header-actions">
            <button className="notification-btn" aria-label="Notifications">🔔</button>
            <div className="user-profile">
              <span className="avatar">{user?.name?.charAt(0) || 'A'}</span>
              <span>{user?.name || 'Admin'}</span>
            </div>
          </div>
        </header>
        
        {renderContent()}

        {showModal && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={handleCloseModal}
            apiBase={API_BASE}
          />
        )}
      </div>
    </div>
  );
};

// Component for stat cards
const StatCard = ({ title, value, change, icon }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
      <p className="stat-change">{change}</p>
    </div>
  </div>
);

// Placeholder components for other tabs
const OrdersTab = () => <div className="tab-content"><Orders /></div>;
const ProductsTab = () => <div className="tab-content"><AdminProducts /></div>;
const CustomersTab = () => <div className="tab-content"><Customers /></div>;
const SalesTab = () => <div className="tab-content"><Sales /></div>;
const SettingsTab = () => <div className="tab-content"><AdminSettings /></div>;
const ChatsTab = () => <div className="tab-content"><AdminChat /></div>;

export default Dashboard;