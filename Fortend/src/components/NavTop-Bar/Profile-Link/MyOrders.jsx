




// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import './MyOrders.css';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
// const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/50?text=No+Image';
// const RETURN_REASONS = [
//   'Defective Product',
//   'Wrong Item Received',
//   'Not as Described',
//   'Changed Mind',
//   'Other',
// ];

// const MyOrders = () => {
//   const { user, token } = useAuth();
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [showReturnModal, setShowReturnModal] = useState(false);
//   const [returnOrderId, setReturnOrderId] = useState(null);
//   const [returnReason, setReturnReason] = useState('');
//   const [returnDetails, setReturnDetails] = useState('');

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!user || !token) {
//       setError('Please log in to view your orders');
//       setLoading(false);
//       navigate('/login');
//     }
//   }, [user, token, navigate]);

//   // Fetch wallet balance
//   const fetchWalletBalance = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/api/wallet`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch wallet');
//       }
//       const data = await response.json();
//       setWalletBalance(data.balance);
//       return data.balance;
//     } catch (err) {
//       console.error('Fetch wallet error:', err.message);
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Check if order is eligible for return (within 5 days of delivery)
//   const isReturnEligible = (order) => {
//     if (order.status !== 'Delivered') return false;
//     const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.createdAt);
//     const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
//     const currentDate = new Date();
//     return currentDate - deliveryDate <= fiveDaysInMs;
//   };

//   // Normalize image URL
//   const normalizeImageUrl = (imageUrl) => {
//     if (!imageUrl) return PLACEHOLDER_IMAGE;
//     const normalized = imageUrl.replace(/^[Uu]ploads\//, '/Uploads/');
//     if (normalized.startsWith('http')) return normalized;
//     if (!normalized.startsWith('/')) return `/${normalized}`;
//     return `${API_BASE}${normalized}`;
//   };

//   // Fetch user orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!user || !token) return;

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

//         const ordersData = await response.json();
//         console.log('Fetched orders:', ordersData.length);
//         setOrders(
//           ordersData
//             .map((order) => ({
//               id: order._id,
//               date: new Date(order.createdAt).toLocaleDateString(),
//               items: order.items.map((item) => ({
//                 ...item,
//                 imageUrl: normalizeImageUrl(item.imageUrl),
//               })),
//               baseTotal:
//                 order.totals.baseTotal ??
//                 order.totals.subtotal + order.totals.gstAmount - (order.totals.promoDiscount || 0),
//               totalAmount: order.totals.totalAmount ?? 0,
//               walletAmountUsed: order.totals.walletAmountUsed ?? 0,
//               status: order.status,
//               createdAt: order.createdAt,
//               deliveredAt: order.deliveredAt,
//             }))
//             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         );

//         await fetchWalletBalance();
//       } catch (err) {
//         console.error('Fetch orders error:', err.message);
//         setError(err.message);
//         if (err.message.includes('Unauthorized')) {
//           navigate('/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user && token) {
//       fetchOrders();
//     }
//   }, [user, token, navigate]);

//   // Handle View button click
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
//       setSelectedOrder({
//         ...order,
//         items: order.items.map((item) => ({
//           ...item,
//           imageUrl: normalizeImageUrl(item.imageUrl),
//         })),
//         totals: {
//           ...order.totals,
//           baseTotal:
//             order.totals.baseTotal ??
//             order.totals.subtotal + order.totals.gstAmount - (order.totals.promoDiscount || 0),
//           totalAmount: order.totals.totalAmount ?? 0,
//           walletAmountUsed: order.totals.walletAmountUsed ?? 0,
//         },
//       });
//       setShowModal(true);
//     } catch (err) {
//       console.error('Fetch order details error:', err.message);
//       setError(err.message);
//     }
//   };

//   // Handle Cancel button click
//   const handleCancelOrder = async (orderId) => {
//     if (
//       !window.confirm(
//         'Are you sure you want to cancel this order? 18% GST will be deducted as a cancellation fee, and the remaining amount will be refunded to your wallet.'
//       )
//     )
//       return;

//     try {
//       const order = orders.find((o) => o.id === orderId);
//       if (!order) throw new Error('Order not found');

//       const gstRate = 0.18;
//       const gstDeduction = order.baseTotal * gstRate;
//       const refundAmount = order.baseTotal;
//       const netRefunded = refundAmount - gstDeduction;

//       const response = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           refundAmount: refundAmount,
//           gstDeduction: gstDeduction,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to cancel order');
//       }

//       const result = await response.json();
//       console.log('Order cancelled:', result);
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.id === orderId ? { ...order, status: 'Cancelled' } : order
//         )
//       );
//       setError(null);

//       const newBalance = await fetchWalletBalance();
//       alert(
//         `${result.message}\n` +
//           `18% GST (₹${gstDeduction.toFixed(2)}) deducted as cancellation fee.\n` +
//           `Net amount refunded to wallet: ₹${netRefunded.toFixed(2)}\n` +
//           `New wallet balance: ₹${newBalance.toFixed(2)}`
//       );

//       window.dispatchEvent(new Event('orderPlaced'));
//     } catch (err) {
//       console.error('Cancel order error:', err.message);
//       setError(err.message);
//     }
//   };

//   // Open return reason modal
//   const handleOpenReturnModal = (orderId) => {
//     setReturnOrderId(orderId);
//     setReturnReason('');
//     setReturnDetails('');
//     setShowReturnModal(true);
//   };

//   // Handle return submission
//   const handleSubmitReturn = async () => {
//     if (!returnReason) {
//       setError('Please select a reason for the return');
//       return;
//     }

//     try {
//       const order = orders.find((o) => o.id === returnOrderId);
//       if (!order) throw new Error('Order not found');

//       if (!isReturnEligible(order)) {
//         throw new Error('Return period has expired or order is not delivered');
//       }

//       const response = await fetch(`${API_BASE}/api/orders/${returnOrderId}/return/request`, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           returnReason: String(returnReason),
//           returnDetails: String(returnDetails || ''),
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to request return');
//       }

//       const result = await response.json();
//       console.log('Return requested:', result);
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.id === returnOrderId ? { ...order, status: 'Return Requested' } : order
//         )
//       );
//       setError(null);

//       alert('Return request submitted successfully. Awaiting admin confirmation.');

//       setShowReturnModal(false);
//       setReturnOrderId(null);
//       setReturnReason('');
//       setReturnDetails('');

//       window.dispatchEvent(new Event('orderPlaced'));
//     } catch (err) {
//       console.error('Return order error:', err.message);
//       setError(err.message);
//     }
//   };

//   // Handle confirm return (Admin only)
//   const handleConfirmReturn = async (orderId) => {
//     if (
//       !window.confirm(
//         'Are you sure you want to confirm the return? A refund will be issued to the user’s wallet after deducting an 18% GST fee.'
//       )
//     )
//       return;

//     try {
//       const order = orders.find((o) => o.id === orderId);
//       if (!order) throw new Error('Order not found');

//       const gstRate = 0.18;
//       const gstDeduction = order.baseTotal * gstRate;
//       const refundAmount = order.baseTotal;
//       const netRefunded = refundAmount - gstDeduction;

//       const response = await fetch(`${API_BASE}/api/orders/${orderId}/return/confirm`, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           refundAmount,
//           gstDeduction,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to confirm return');
//       }

//       const result = await response.json();
//       console.log('Return confirmed:', result);

//       // Refresh orders list
//       const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!ordersResponse.ok) {
//         const errorData = await ordersResponse.json();
//         throw new Error(errorData.error || 'Failed to fetch updated orders');
//       }
//       const ordersData = await ordersResponse.json();
//       setOrders(
//         ordersData
//           .map((order) => ({
//             id: order._id,
//             date: new Date(order.createdAt).toLocaleDateString(),
//             items: order.items.map((item) => ({
//               ...item,
//               imageUrl: normalizeImageUrl(item.imageUrl),
//             })),
//             baseTotal:
//               order.totals.baseTotal ??
//               order.totals.subtotal + order.totals.gstAmount - (order.totals.promoDiscount || 0),
//             totalAmount: order.totals.totalAmount ?? 0,
//             walletAmountUsed: order.totals.walletAmountUsed ?? 0,
//             status: order.status,
//             createdAt: order.createdAt,
//             deliveredAt: order.deliveredAt,
//           }))
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       );

//       setError(null);

//       const newBalance = await fetchWalletBalance();
//       alert(
//         `${result.message}\n` +
//         `18% GST (₹${gstDeduction.toFixed(2)}) deducted as return fee.\n` +
//         `Net amount refunded to wallet: ₹${netRefunded.toFixed(2)}\n` +
//         `New wallet balance: ₹${newBalance.toFixed(2)}`
//       );

//       window.dispatchEvent(new Event('orderPlaced'));
//     } catch (err) {
//       console.error('Confirm return error:', err.message);
//       setError(err.message);
//     }
//   };

//   // Handle reorder option
//   const handleReorder = () => {
//     setShowReturnModal(false);
//     setReturnOrderId(null);
//     setReturnReason('');
//     setReturnDetails('');
//     navigate('/products');
//   };

//   // Close modals
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedOrder(null);
//   };

//   const handleCloseReturnModal = () => {
//     setShowReturnModal(false);
//     setReturnOrderId(null);
//     setReturnReason('');
//     setReturnDetails('');
//   };

//   // Get status badge class
//   const getStatusBadgeClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'shipped':
//         return 'status-shipped';
//       case 'delivered':
//         return 'status-delivered';
//       case 'processing':
//         return 'status-processing';
//       case 'cancelled':
//         return 'status-cancelled';
//       case 'return requested':
//         return 'status-return-requested';
//       case 'returned':
//         return 'status-returned';
//       default:
//         return 'status-pending';
//     }
//   };

//   if (!user || !token) return null;

//   return (
//     <div className="my-orders-container">
//       <h2>My Orders</h2>
//       <p>Wallet Balance: ₹{walletBalance.toFixed(2)}</p>
//       {loading ? (
//         <p className="loading">Loading your orders...</p>
//       ) : error ? (
//         <p className="error-message">{error}</p>
//       ) : (
//         <div className="orders-table-container">
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Date</th>
//                 <th>Items</th>
//                 <th>Total</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.length > 0 ? (
//                 orders.map((order) => (
//                   <tr
//                     key={order.id}
//                     onClick={() => order.items[0] && navigate(`/products/${order.items[0]._id}`)}
//                     className="clickable-row"
//                   >
//                     <td>#{order.id}</td>
//                     <td>{order.date}</td>
//                     <td>
//                       <div className="items-container">
//                         {order.items.map((item) => (
//                           <div key={item._id} className="item-row">
//                             <img
//                               src={item.imageUrl}
//                               alt={item.name}
//                               className="item-image"
//                               onError={(e) => {
//                                 console.error(`Image load error for ${item.name}: ${item.imageUrl}`);
//                                 e.target.src = PLACEHOLDER_IMAGE;
//                               }}
//                             />
//                             <span>
//                               {item.name} (x{item.quantity})
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </td>
//                     <td>₹{(order.baseTotal ?? 0).toFixed(2)}</td>
//                     <td>
//                       <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
//                         {order.status}
//                       </span>
//                     </td>
//                     <td>
//                       <button
//                         className="view-btn"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleViewOrder(order.id);
//                         }}
//                       >
//                         View
//                       </button>
//                       {order.status === 'Pending' && (
//                         <button
//                           className="cancel-btn"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleCancelOrder(order.id);
//                           }}
//                         >
//                           Cancel
//                         </button>
//                       )}
//                       {isReturnEligible(order) && (
//                         <button
//                           className="return-btn"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleOpenReturnModal(order.id);
//                           }}
//                         >
//                           Return
//                         </button>
//                       )}
//                       {user.role === 'admin' && order.status === 'Return Requested' && (
//                         <button
//                           className="confirm-return-btn"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleConfirmReturn(order.id);
//                           }}
//                         >
//                           Confirm Return
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="no-orders">
//                     No orders found. <a href="/">Shop now!</a>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {showModal && selectedOrder && (
//         <div className="order-details-modal">
//           <div className="modal-content">
//             <span className="close-btn" onClick={handleCloseModal}>
//               ×
//             </span>
//             <h3>
//               Order Details - #{selectedOrder._id}
//             </h3>
//             <div className="modal-section">
//               <h4>Items</h4>
//               {selectedOrder.items.map((item) => (
//                 <div key={item._id} className="modal-item">
//                   <img
//                     src={item.imageUrl}
//                     alt={item.name}
//                     className="modal-item-image"
//                     onError={(e) => {
//                       console.error(`Image load error for ${item.name}: ${item.imageUrl}`);
//                       e.target.src = 'https://via.placeholder.com/60?text=No+Image';
//                     }}
//                   />
//                   <div className="modal-item-details">
//                     <p>
//                       <strong>{item.name}</strong>
//                     </p>
//                     <p>Quantity: {item.quantity}</p>
//                     <p>Price: ₹{item.price.toFixed(2)}</p>
//                     <p>Total: ₹{(item.quantity * item.price).toFixed(2)}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="modal-section">
//               <h4>Shipping Information</h4>
//               <p>
//                 <strong>Name:</strong> {selectedOrder.shipping.name}
//               </p>
//               <p>
//                 <strong>Address:</strong> {selectedOrder.shipping.address},{' '}
//                 {selectedOrder.shipping.city}, {selectedOrder.shipping.postalCode}
//               </p>
//               <p>
//                 <strong>Phone:</strong> {selectedOrder.shipping.phone}
//               </p>
//               <p>
//                 <strong>Email:</strong> {selectedOrder.shipping.email}
//               </p>
//             </div>
//             <div className="modal-section">
//               <h4>Payment Method</h4>
//               <p>
//                 <strong>Method:</strong> {selectedOrder.payment.method}
//                 {selectedOrder.payment.upiId && ` (${selectedOrder.payment.upiId})`}
//                 {selectedOrder.payment.cardLastFour &&
//                   ` (**** **** **** ${selectedOrder.payment.cardLastFour})`}
//                 {selectedOrder.totals.walletAmountUsed > 0 ? ' + Wallet' : ''}
//               </p>
//             </div>
//             <div className="modal-section">
//               <h4>Order Totals</h4>
//               <p>
//                 <strong>Subtotal:</strong> ₹{selectedOrder.totals.subtotal.toFixed(2)}
//               </p>
//               <p>
//                 <strong>GST (18%):</strong> ₹{selectedOrder.totals.gstAmount.toFixed(2)}
//               </p>
//               {selectedOrder.totals.promoDiscount > 0 && (
//                 <p>
//                   <strong>Promo Discount:</strong> -₹
//                   {selectedOrder.totals.promoDiscount.toFixed(2)}
//                 </p>
//               )}
//               <p>
//                 <strong>Total (Before Payments):</strong> ₹
//                 {(selectedOrder.totals.baseTotal ?? 0).toFixed(2)}
//               </p>
//               {selectedOrder.totals.walletAmountUsed > 0 && (
//                 <p>
//                   <strong>Wallet Payment:</strong> -₹
//                   {selectedOrder.totals.walletAmountUsed.toFixed(2)}
//                 </p>
//               )}
//               <p>
//                 <strong>
//                   {selectedOrder.payment.method} Payment:
//                 </strong>{' '}
//                 ₹{selectedOrder.totals.totalAmount.toFixed(2)}
//               </p>
//               <p>
//                 <strong>Shipping:</strong> FREE
//               </p>
//               {selectedOrder.totals.promoCode && (
//                 <p>
//                   <strong>Promo Code:</strong> {selectedOrder.totals.promoCode}
//                 </p>
//               )}
//               {selectedOrder.status === 'Pending' && (
//                 <p className="refund-note">
//                   <strong>Note:</strong> On cancellation, an 18% GST fee (₹
//                   {(selectedOrder.totals.baseTotal * 0.18).toFixed(2)}) is deducted, and
//                   the remaining amount (₹
//                   {(selectedOrder.totals.baseTotal * (1 - 0.18)).toFixed(2)}) is
//                   refunded to your wallet instantly.
//                 </p>
//               )}
//               {selectedOrder.status === 'Delivered' && (
//                 <p className="return-note">
//                   <strong>Return Policy:</strong> You can return this order within 5 days
//                   of delivery. An 18% GST fee (₹
//                   {(selectedOrder.totals.baseTotal * 0.18).toFixed(2)}) will be
//                   deducted, and the remaining amount (₹
//                   {(selectedOrder.totals.baseTotal * (1 - 0.18)).toFixed(2)}) will be
//                   refunded to your wallet upon admin confirmation.{' '}
//                   {isReturnEligible(selectedOrder)
//                     ? `Eligible for return until ${new Date(
//                         new Date(
//                           selectedOrder.deliveredAt || selectedOrder.createdAt
//                         ).getTime() +
//                           5 * 24 * 60 * 60 * 1000
//                       ).toLocaleDateString()}.`
//                     : 'Return period has expired.'}
//                 </p>
//               )}
//             </div>
//             <div className="modal-section">
//               <h4>Status</h4>
//               <p>
//                 <strong>Status:</strong> {selectedOrder.status}
//               </p>
//               <p>
//                 <strong>Order Date:</strong>{' '}
//                 {new Date(selectedOrder.createdAt).toLocaleString()}
//               </p>
//               {selectedOrder.status === 'Delivered' &&
//                 selectedOrder.deliveredAt && (
//                   <p>
//                     <strong>Delivered On:</strong>{' '}
//                     {new Date(selectedOrder.deliveredAt).toLocaleString()}
//                   </p>
//                 )}
//             </div>
//             <button className="modal-close-btn" onClick={handleCloseModal}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {showReturnModal && returnOrderId && (
//         <div className="return-modal">
//           <div className="modal-content">
//             <span className="close-btn" onClick={handleCloseReturnModal}>
//               ×
//             </span>
//             <h3>Return Order #{returnOrderId}</h3>
//             <div className="modal-section">
//               <h4>Reason for Return</h4>
//               <select
//                 value={returnReason}
//                 onChange={(e) => setReturnReason(e.target.value)}
//                 className="return-reason-select"
//               >
//                 <option value="">Select a reason</option>
//                 {RETURN_REASONS.map((reason) => (
//                   <option key={reason} value={reason}>
//                     {reason}
//                   </option>
//                 ))}
//               </select>
//               <textarea
//                 value={returnDetails}
//                 onChange={(e) => setReturnDetails(e.target.value)}
//                 placeholder="Additional details (optional)"
//                 className="return-details-textarea"
//                 rows="4"
//               />
//             </div>
//             <div className="modal-section">
//               <p>
//                 <strong>Note:</strong> An 18% GST fee will be deducted, and the remaining amount
//                 will be refunded to your wallet upon admin confirmation.
//               </p>
//               <p>
//                 Would you like to reorder a different product after initiating the return?
//               </p>
//             </div>
//             <div className="modal-actions">
//               <button
//                 className="modal-submit-btn"
//                 onClick={handleSubmitReturn}
//                 disabled={!returnReason}
//               >
//                 Submit Return
//               </button>
//               <button className="modal-reorder-btn" onClick={handleReorder}>
//                 Reorder Different Product
//               </button>
//               <button className="modal-close-btn" onClick={handleCloseReturnModal}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrders;





















import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyOrders.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/50?text=No+Image';
const RETURN_REASONS = [
  'Defective Product',
  'Wrong Item Received',
  'Not as Described',
  'Changed Mind',
  'Other',
];

const MyOrders = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnOrderId, setReturnOrderId] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnDetails, setReturnDetails] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user || !token) {
      setError('Please log in to view your orders');
      setLoading(false);
      navigate('/login');
    }
  }, [user, token, navigate]);

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch wallet');
      }
      const data = await response.json();
      setWalletBalance(data.balance);
      return data.balance;
    } catch (err) {
      console.error('Fetch wallet error:', err.message);
      setError(err.message);
      throw err;
    }
  };

  // Check if order is eligible for return (within 5 days of delivery)
  const isReturnEligible = (order) => {
    if (order.status !== 'Delivered') return false;
    const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.createdAt);
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    return currentDate - deliveryDate <= fiveDaysInMs;
  };

  // Normalize image URL
  const normalizeImageUrl = (imageUrl) => {
    if (!imageUrl) return PLACEHOLDER_IMAGE;
    const normalized = imageUrl.replace(/^[Uu]ploads\//, '/Uploads/');
    if (normalized.startsWith('http')) return normalized;
    if (!normalized.startsWith('/')) return `/${normalized}`;
    return `${API_BASE}${normalized}`;
  };

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !token) return;

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

        const ordersData = await response.json();
        console.log('Fetched orders:', ordersData.length);
        setOrders(
          ordersData
            .map((order) => ({
              id: order._id,
              date: new Date(order.createdAt).toLocaleDateString(),
              items: order.items.map((item) => ({
                ...item,
                imageUrl: normalizeImageUrl(item.imageUrl),
              })),
              baseTotal:
                order.totals.baseTotal ??
                order.totals.subtotal + order.totals.gstAmount - (order.totals.promoDiscount || 0),
              totalAmount: order.totals.totalAmount ?? 0,
              walletAmountUsed: order.totals.walletAmountUsed ?? 0,
              status: order.status,
              createdAt: order.createdAt,
              deliveredAt: order.deliveredAt,
              returnDetails: order.returnDetails || { reason: '', details: '' },
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );

        await fetchWalletBalance();
      } catch (err) {
        console.error('Fetch orders error:', err.message);
        setError(err.message);
        if (err.message.includes('Unauthorized')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchOrders();
    }
  }, [user, token, navigate]);

  // Handle View button click
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
      setSelectedOrder({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          imageUrl: normalizeImageUrl(item.imageUrl),
        })),
        totals: {
          ...order.totals,
          baseTotal:
            order.totals.baseTotal ??
            order.totals.subtotal + order.totals.gstAmount - (order.totals.promoDiscount || 0),
          totalAmount: order.totals.totalAmount ?? 0,
          walletAmountUsed: order.totals.walletAmountUsed ?? 0,
        },
        returnDetails: order.returnDetails || { reason: '', details: '' },
      });
      setShowModal(true);
    } catch (err) {
      console.error('Fetch order details error:', err.message);
      setError(err.message);
    }
  };

  // Handle Cancel button click
  const handleCancelOrder = async (orderId) => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this order? 18% GST will be deducted as a cancellation fee, and the remaining amount will be refunded to your wallet.'
      )
    )
      return;

    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) throw new Error('Order not found');

      const gstRate = 0.18;
      const gstDeduction = order.baseTotal * gstRate;
      const refundAmount = order.baseTotal;
      const netRefunded = refundAmount - gstDeduction;

      const response = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refundAmount: refundAmount,
          gstDeduction: gstDeduction,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel order');
      }

      const result = await response.json();
      console.log('Order cancelled:', result);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
      setError(null);

      const newBalance = await fetchWalletBalance();
      alert(
        `${result.message}\n` +
          `18% GST (₹${gstDeduction.toFixed(2)}) deducted as cancellation fee.\n` +
          `Net amount refunded to wallet: ₹${netRefunded.toFixed(2)}\n` +
          `New wallet balance: ₹${newBalance.toFixed(2)}`
      );

      window.dispatchEvent(new Event('orderPlaced'));
    } catch (err) {
      console.error('Cancel order error:', err.message);
      setError(err.message);
    }
  };

  // Open return reason modal
  const handleOpenReturnModal = (orderId) => {
    setReturnOrderId(orderId);
    setReturnReason('');
    setReturnDetails('');
    setShowReturnModal(true);
  };

  // Handle return submission
  const handleSubmitReturn = async () => {
    if (!returnReason) {
      setError('Please select a reason for the return');
      return;
    }

    try {
      const order = orders.find((o) => o.id === returnOrderId);
      if (!order) throw new Error('Order not found');

      if (!isReturnEligible(order)) {
        throw new Error('Return period has expired or order is not delivered');
      }

      const response = await fetch(`${API_BASE}/api/orders/${returnOrderId}/return/request`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnReason: String(returnReason),
          returnDetails: String(returnDetails || ''),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to request return');
      }

      const result = await response.json();
      console.log('Return requested:', result);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === returnOrderId ? { ...order, status: 'Return Requested' } : order
        )
      );
      setError(null);

      alert('Return request submitted successfully. Awaiting admin confirmation.');

      setShowReturnModal(false);
      setReturnOrderId(null);
      setReturnReason('');
      setReturnDetails('');

      window.dispatchEvent(new Event('orderPlaced'));
    } catch (err) {
      console.error('Return order error:', err.message);
      setError(err.message);
    }
  };

  // Handle confirm return (Admin only)
  const handleConfirmReturn = async (orderId) => {
    if (
      !window.confirm(
        'Are you sure you want to confirm the return? A refund will be issued to the user’s wallet after deducting an 18% GST fee.'
      )
    )
      return;

    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) throw new Error('Order not found');

      const gstRate = 0.18;
      const gstDeduction = order.baseTotal * gstRate;
      const refundAmount = order.baseTotal;
      const netRefunded = refundAmount - gstDeduction;

      const response = await fetch(`${API_BASE}/api/orders/${orderId}/return/confirm`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refundAmount,
          gstDeduction,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm return');
      }

      const result = await response.json();
      console.log('Return confirmed:', result);

      // Refresh orders list
      const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!ordersResponse.ok) {
        const errorData = await ordersResponse.json();
        throw new Error(errorData.error || 'Failed to fetch updated orders');
      }
      const ordersData = await ordersResponse.json();
      setOrders(
        ordersData
          .map((order) => ({
            id: order._id,
            date: new Date(order.createdAt).toLocaleDateString(),
            items: order.items.map((item) => ({
              ...item,
              imageUrl: normalizeImageUrl(item.imageUrl),
            })),
            baseTotal:
              order.totals.baseTotal ??
              order.totals.subtotal + order.totals.gstAmount - (order.totals.promoDiscount || 0),
            totalAmount: order.totals.totalAmount ?? 0,
            walletAmountUsed: order.totals.walletAmountUsed ?? 0,
            status: order.status,
            createdAt: order.createdAt,
            deliveredAt: order.deliveredAt,
            returnDetails: order.returnDetails || { reason: '', details: '' },
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );

      setError(null);

      const newBalance = await fetchWalletBalance();
      alert(
        `${result.message}\n` +
        `18% GST (₹${gstDeduction.toFixed(2)}) deducted as return fee.\n` +
        `Net amount refunded to wallet: ₹${netRefunded.toFixed(2)}\n` +
        `New wallet balance: ₹${newBalance.toFixed(2)}`
      );

      window.dispatchEvent(new Event('orderPlaced'));
    } catch (err) {
      console.error('Confirm return error:', err.message);
      setError(err.message);
    }
  };

  // Handle reorder option
  const handleReorder = () => {
    setShowReturnModal(false);
    setReturnOrderId(null);
    setReturnReason('');
    setReturnDetails('');
    navigate('/products');
  };

  // Close modals
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleCloseReturnModal = () => {
    setShowReturnModal(false);
    setReturnOrderId(null);
    setReturnReason('');
    setReturnDetails('');
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'processing':
        return 'status-processing';
      case 'cancelled':
        return 'status-cancelled';
      case 'return requested':
        return 'status-return-requested';
      case 'returned':
        return 'status-returned';
      default:
        return 'status-pending';
    }
  };

  if (!user || !token) return null;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      <p>Wallet Balance: ₹{walletBalance.toFixed(2)}</p>
      {loading ? (
        <p className="loading-message">Loading your orders...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-list">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => order.items[0] && navigate(`/products/${order.items[0]._id}`)}
                    className="order-row"
                  >
                    <td>#{order.id}</td>
                    <td>{order.date}</td>
                    <td>
                      <div className="order-items">
                        {order.items.map((item) => (
                          <div key={item._id} className="order-item">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="item-img"
                              onError={(e) => {
                                console.error(`Image load error for ${item.name}: ${item.imageUrl}`);
                                e.target.src = PLACEHOLDER_IMAGE;
                              }}
                            />
                            <span>
                              {item.name} (x{item.quantity})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>₹{(order.baseTotal ?? 0).toFixed(2)}</td>
                    <td>
                      <span className={`order-status ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-view-order"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrder(order.id);
                        }}
                      >
                        View
                      </button>
                      {order.status === 'Pending' && (
                        <button
                          className="btn-cancel-order"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelOrder(order.id);
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      {isReturnEligible(order) && (
                        <button
                          className="btn-return-order"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReturnModal(order.id);
                          }}
                        >
                          Return
                        </button>
                      )}
                      {user.role === 'admin' && order.status === 'Return Requested' && (
                        <button
                          className="btn-confirm-return"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmReturn(order.id);
                          }}
                        >
                          Confirm Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-orders-message">
                    No orders found. <a href="/">Shop now!</a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedOrder && (
        <div className="order-details-dialog">
          <div className="dialog-content">
            <span className="btn-close-dialog" onClick={handleCloseModal}>
             
            </span>
            <h3>
              Order Details - #{selectedOrder._id}
            </h3>
            <div className="dialog-section">
              <h4>Items</h4>
              {selectedOrder.items.map((item) => (
                <div key={item._id} className="dialog-item">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="dialog-item-img"
                    onError={(e) => {
                      console.error(`Image load error for ${item.name}: ${item.imageUrl}`);
                      e.target.src = 'https://via.placeholder.com/60?text=No+Image';
                    }}
                  />
                  <div className="dialog-item-info">
                    <p>
                      <strong>{item.name}</strong>
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.price.toFixed(2)}</p>
                    <p>Total: ₹{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="dialog-section">
              <h4>Shipping Information</h4>
              <p>
                <strong>Name:</strong> {selectedOrder.shipping.name}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.shipping.address},{' '}
                {selectedOrder.shipping.city}, {selectedOrder.shipping.postalCode}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.shipping.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.shipping.email}
              </p>
            </div>
            <div className="dialog-section">
              <h4>Payment Method</h4>
              <p>
                <strong>Method:</strong> {selectedOrder.payment.method}
                {selectedOrder.payment.upiId && ` (${selectedOrder.payment.upiId})`}
                {selectedOrder.payment.cardLastFour &&
                  ` (**** **** **** ${selectedOrder.payment.cardLastFour})`}
                {selectedOrder.totals.walletAmountUsed > 0 ? ' + Wallet' : ''}
              </p>
            </div>
            <div className="dialog-section">
              <h4>Order Totals</h4>
              <p>
                <strong>Subtotal:</strong> ₹{selectedOrder.totals.subtotal.toFixed(2)}
              </p>
              <p>
                <strong>GST (18%):</strong> ₹{selectedOrder.totals.gstAmount.toFixed(2)}
              </p>
              {selectedOrder.totals.promoDiscount > 0 && (
                <p>
                  <strong>Promo Discount:</strong> -₹
                  {selectedOrder.totals.promoDiscount.toFixed(2)}
                </p>
              )}
              <p>
                <strong>Total (Before Payments):</strong> ₹
                {(selectedOrder.totals.baseTotal ?? 0).toFixed(2)}
              </p>
              {selectedOrder.totals.walletAmountUsed > 0 && (
                <p>
                  <strong>Wallet Payment:</strong> -₹
                  {selectedOrder.totals.walletAmountUsed.toFixed(2)}
                </p>
              )}
              <p>
                <strong>
                  {selectedOrder.payment.method} Payment:
                </strong>{' '}
                ₹{selectedOrder.totals.totalAmount.toFixed(2)}
              </p>
              <p>
                <strong>Shipping:</strong> FREE
              </p>
              {selectedOrder.totals.promoCode && (
                <p>
                  <strong>Promo Code:</strong> {selectedOrder.totals.promoCode}
                </p>
              )}
              {selectedOrder.status === 'Pending' && (
                <p className="refund-info">
                  <strong>Note:</strong> On cancellation, an 18% GST fee (₹
                  {(selectedOrder.totals.baseTotal * 0.18).toFixed(2)}) is deducted, and
                  the remaining amount (₹
                  {(selectedOrder.totals.baseTotal * (1 - 0.18)).toFixed(2)}) is
                  refunded to your wallet instantly.
                </p>
              )}
              {selectedOrder.status === 'Delivered' && (
                <p className="return-policy">
                  <strong>Return Policy:</strong> You can return this order within 5 days
                  of delivery. An 18% GST fee (₹
                  {(selectedOrder.totals.baseTotal * 0.18).toFixed(2)}) will be
                  deducted, and the remaining amount (₹
                  {(selectedOrder.totals.baseTotal * (1 - 0.18)).toFixed(2)}) will be
                  refunded to your wallet upon admin confirmation.{' '}
                  {isReturnEligible(selectedOrder)
                    ? `Eligible for return until ${new Date(
                        new Date(
                          selectedOrder.deliveredAt || selectedOrder.createdAt
                        ).getTime() +
                          5 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}.`
                    : 'Return period has expired.'}
                </p>
              )}
            </div>
            <div className="dialog-section">
              <h4>Status</h4>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Order Date:</strong>{' '}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              {selectedOrder.status === 'Delivered' &&
                selectedOrder.deliveredAt && (
                  <p>
                    <strong>Delivered On:</strong>{' '}
                    {new Date(selectedOrder.deliveredAt).toLocaleString()}
                  </p>
                )}
            </div>
            {(selectedOrder.status === 'Return Requested' || selectedOrder.status === 'Returned') &&
              selectedOrder.returnDetails?.reason && (
                <div className="dialog-section return-info">
                  <h4>Return Details</h4>
                  <p>
                    <strong>Reason:</strong> {selectedOrder.returnDetails.reason}
                  </p>
                  {selectedOrder.returnDetails.details && (
                    <p>
                      <strong>Additional Details:</strong> {selectedOrder.returnDetails.details}
                    </p>
                  )}
                </div>
              )}
            <button className="btn-close-dialog" onClick={handleCloseModal}>
            ×
            </button>
          </div>
        </div>
      )}

      {showReturnModal && returnOrderId && (
        <div className="return-dialog">
          <div className="dialog-content">
            <span className="btn-close-dialog" onClick={handleCloseReturnModal}>
            
            </span>
            <h3>Return Order #{returnOrderId}</h3>
            <div className="dialog-section">
              <h4>Reason for Return</h4>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="return-reason-dropdown"
              >
                <option value="">Select a reason</option>
                {RETURN_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              <textarea
                value={returnDetails}
                onChange={(e) => setReturnDetails(e.target.value)}
                placeholder="Additional details (optional)"
                className="return-details-input"
                rows="4"
              />
            </div>
            <div className="dialog-section">
              <p>
                <strong>Note:</strong> An 18% GST fee will be deducted, and the remaining amount
                will be refunded to your wallet upon admin confirmation.
              </p>
              <p>
                Would you like to reorder a different product after initiating the return?
              </p>
            </div>
            <div className="dialog-actions">
              <button
                className="btn-submit-return"
                onClick={handleSubmitReturn}
                disabled={!returnReason}
              >
                Submit Return
              </button>
              <button className="btn-reorder" onClick={handleReorder}>
                Reorder Different Product
              </button>
              <button className="btn-close-dialog" onClick={handleCloseReturnModal}>
              ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;