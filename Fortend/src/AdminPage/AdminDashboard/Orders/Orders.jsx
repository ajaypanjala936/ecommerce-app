





// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import OrderDetailsModal from './OrderDetailsModal';
// import './Orders.css';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// const Orders = () => {
//   const { user, token } = useAuth();
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   // Redirect if not authenticated or not admin
//   useEffect(() => {
//     if (!user || !token || user.role !== 'admin') {
//       console.log('Redirecting: Not admin or not authenticated', { userRole: user?.role, hasToken: !!token });
//       navigate('/admin-login');
//     }
//   }, [user, token, navigate]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!token) return;

//       try {
//         setLoading(true);
//         setError(null);
//         console.log('Fetching orders with token:', token.substring(0, 10) + '...');
//         const response = await fetch(`${API_BASE}/api/orders`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           if (response.status === 401) {
//             throw new Error('Unauthorized: Please log in again');
//           }
//           throw new Error(errorData.error || 'Failed to fetch orders');
//         }
//         const data = await response.json();
//         console.log('Fetched orders:', data);
//         const formattedOrders = data.map(order => {
//           // Fallback: Calculate amount from items if totalAmount is 0 or undefined
//           let amount = order.totals?.totalAmount || 0;
//           if (amount === 0 && order.items?.length > 0) {
//             amount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//             console.warn(`Order ${order._id} has zero totalAmount, calculated from items: $${amount.toFixed(2)}`);
//           }
//           return {
//             id: order._id,
//             customer: order.shipping.name,
//             date: new Date(order.createdAt).toLocaleDateString(),
//             amount,
//             status: order.status,
//             items: order.items.map(item => item.name).join(', '),
//           };
//         });
//         setOrders(formattedOrders);
//       } catch (err) {
//         console.error('Fetch orders error:', err);
//         setError(err.message);
//         if (err.message.includes('Unauthorized')) {
//           navigate('/admin/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user && token) {
//       fetchOrders();
//     }
//   }, [user, token, navigate]);

//   const handleViewOrder = async (orderId) => {
//     try {
//       const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch order details');
//       }
//       const order = await response.json();
//       console.log('Fetched order details:', order);
//       // Fallback: Calculate totalAmount for modal if zero
//       if (!order.totals?.totalAmount && order.items?.length > 0) {
//         order.totals = {
//           ...order.totals,
//           totalAmount: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
//         };
//         console.warn(`Order ${order._id} modal has zero totalAmount, calculated from items: $${order.totals.totalAmount.toFixed(2)}`);
//       }
//       setSelectedOrder(order);
//       setShowModal(true);
//     } catch (err) {
//       console.error('Fetch order details error:', err);
//       setError(err.message);
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedOrder(null);
//   };

//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const sortedOrders = React.useMemo(() => {
//     let sortableOrders = [...orders];
//     if (sortConfig.key) {
//       sortableOrders.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableOrders;
//   }, [orders, sortConfig]);

//   const filteredOrders = sortedOrders.filter(order => {
//     const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const getStatusBadgeClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'shipped': return 'status-shipped';
//       case 'delivered': return 'status-delivered';
//       case 'processing': return 'status-processing';
//       case 'cancelled': return 'status-cancelled';
//       case 'pending': return 'status-pending';
//       case 'return requested': return 'status-return-requested';
//       case 'returned': return 'status-returned';
//       default: return 'status-default';
//     }
//   };

//   if (!user || !token) return null;

//   return (
//     <div className="orders-container">
//       <h1>Order Management</h1>
      
//       {loading ? (
//         <div className="loading">Loading orders...</div>
//       ) : error ? (
//         <div className="error">Error: {error}</div>
//       ) : (
//         <>
//           <div className="orders-controls">
//             <div className="search-box">
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 aria-label="Search orders"
//               />
//               <span className="search-icon">🔍</span>
//             </div>
            
//             <div className="filter-controls">
//               <label>
//                 Status:
//                 <select 
//                   value={statusFilter} 
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   aria-label="Filter by status"
//                 >
//                   <option value="all">All</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Processing">Processing</option>
//                   <option value="Shipped">Shipped</option>
//                   <option value="Delivered">Delivered</option>
//                   <option value="Cancelled">Cancelled</option>
//                   <option value="Return Requested">Return Requested</option>
//                   <option value="Returned">Returned</option>
//                 </select>
//               </label>
//             </div>
//           </div>
          
//           <div className="orders-table-container">
//             <table className="orders-table">
//               <thead>
//                 <tr>
//                   <th onClick={() => handleSort('id')}>
//                     Order ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th onClick={() => handleSort('customer')}>
//                     Customer {sortConfig.key === 'customer' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th onClick={() => handleSort('date')}>
//                     Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th onClick={() => handleSort('amount')}>
//                     Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th onClick={() => handleSort('status')}>
//                     Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                   </th>
//                   <th>Items</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrders.length > 0 ? (
//                   filteredOrders.map((order) => (
//                     <tr key={order.id}>
//                       <td>{order.id}</td>
//                       <td>{order.customer}</td>
//                       <td>{order.date}</td>
//                       <td>${order.amount.toFixed(2)}</td>
//                       <td>
//                         <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td>{order.items}</td>
//                       <td className="action-buttons">
//                         <button
//                           className="action-btn view-btn"
//                           onClick={() => handleViewOrder(order.id)}
//                         >
//                           View
//                         </button>
//                         <button className="action-btn edit-btn" disabled>
//                           Edit
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="no-orders">
//                       No orders found. Try adjusting your filters.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
          
//           <div className="orders-summary">
//             <div className="summary-card">
//               <h3>Total Orders</h3>
//               <p>{orders.length}</p>
//             </div>
//             <div className="summary-card">
//               <h3>Total Revenue</h3>
//               <p>${orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}</p>
//             </div>
//             <div className="summary-card">
//               <h3>Avg. Order Value</h3>
//               <p>${(orders.reduce((sum, order) => sum + order.amount, 0) / orders.length || 0).toFixed(2)}</p>
//             </div>
//           </div>
//         </>
//       )}

//       {showModal && selectedOrder && (
//         <OrderDetailsModal
//           order={selectedOrder}
//           onClose={handleCloseModal}
//           apiBase={API_BASE}
//         />
//       )}
//     </div>
//   );
// };

// export default Orders;






import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrderDetailsModal from './OrderDetailsModal';
import './Orders.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const Orders = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!user || !token || user.role !== 'admin') {
      console.log('Redirecting: Not admin or not authenticated', { userRole: user?.role, hasToken: !!token });
      navigate('/admin-login');
    }
  }, [user, token, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching orders with token:', token.substring(0, 10) + '...');
        const response = await fetch(`${API_BASE}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in again');
          }
          throw new Error(errorData.error || 'Failed to fetch orders');
        }
        const data = await response.json();
        console.log('Fetched orders:', data);
        const formattedOrders = data.map(order => {
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
            items: order.items.map(item => item.name).join(', '),
          };
        });
        setOrders(formattedOrders);
      } catch (err) {
        console.error('Fetch orders error:', err);
        setError(err.message);
        if (err.message.includes('Unauthorized')) {
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchOrders();
    }
  }, [user, token, navigate]);

  const handleViewOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch order details');
      }
      const order = await response.json();
      console.log('Fetched order details:', order);
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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = React.useMemo(() => {
    let sortableOrders = [...orders];
    if (sortConfig.key) {
      sortableOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  }, [orders, sortConfig]);

  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'processing': return 'status-processing';
      case 'cancelled': return 'status-cancelled';
      case 'pending': return 'status-pending';
      case 'return requested': return 'status-return-requested';
      case 'returned': return 'status-returned';
      default: return 'status-default';
    }
  };

  if (!user || !token) return null;

  return (
    <div className="orders-container">
      <h1>Order Management</h1>
      
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <>
          <div className="orders-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search orders"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="filter-controls">
              <label>
                Status:
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="all">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Return Requested">Return Requested</option>
                  <option value="Returned">Returned</option>
                </select>
              </label>
            </div>
          </div>
          
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>
                    Order ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('customer')}>
                    Customer {sortConfig.key === 'customer' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('date')}>
                    Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('amount')}>
                    Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('status')}>
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.items}</td>
                      <td className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          View
                        </button>
                        <button className="action-btn edit-btn" disabled>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-orders">
                      No orders found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="orders-summary">
            <div className="summary-card">
              <h3>Total Orders</h3>
              <p>{orders.length}</p>
            </div>
            <div className="summary-card">
              <h3>Total Revenue</h3>
              <p>{orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
            </div>
            <div className="summary-card">
              <h3>Avg. Order Value</h3>
              <p>{(orders.reduce((sum, order) => sum + order.amount, 0) / orders.length || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
            </div>
          </div>
        </>
      )}

      {showModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={handleCloseModal}
          apiBase={API_BASE}
        />
      )}
    </div>
  );
};

export default Orders;