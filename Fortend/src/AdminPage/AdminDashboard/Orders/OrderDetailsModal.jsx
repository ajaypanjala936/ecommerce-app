






// import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
// import './OrderDetailsModal.css';

// const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/60?text=No+Image';

// const OrderDetailsModal = ({ order, onClose, apiBase }) => {
//   // Normalize image URL
//   const normalizeImageUrl = (imageUrl) => {
//     if (!imageUrl) return PLACEHOLDER_IMAGE;
//     const normalized = imageUrl.replace(/^[Uu]ploads\//, '/Uploads/');
//     if (normalized.startsWith('http')) return normalized;
//     if (!normalized.startsWith('/')) return `/${normalized}`;
//     return `${apiBase}${normalized}`;
//   };

//   // Map payment method to user-friendly name
//   const displayPaymentMethod = (method, upiId, walletUsed) => {
//     if (method === 'card') return 'Card';
//     if (method === 'upi' && upiId) {
//       const provider = upiId?.split('@')[1]?.toLowerCase();
//       if (provider === 'phonepe') return 'PhonePe';
//       if (provider === 'gpay') return 'GPay';
//       if (provider === 'paytm') return 'Paytm';
//       return 'UPI';
//     }
//     return method ? method.charAt(0).toUpperCase() + method.slice(1) + (walletUsed > 0 ? ' + Wallet' : '') : 'Unknown';
//   };

//   // Get status badge class (aligned with Orders.jsx)
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

//   // Handle return reason and details (string or object)
//   const getReturnReason = (reason) => {
//     if (!reason) return 'N/A';
//     if (typeof reason === 'string') return reason;
//     if (typeof reason === 'object') {
//       return reason.reason || JSON.stringify(reason);
//     }
//     return 'N/A';
//   };

//   const getReturnDetails = (details) => {
//     if (!details) return 'None provided';
//     if (typeof details === 'string') return details;
//     if (typeof details === 'object') {
//       return details.details || JSON.stringify(details);
//     }
//     return 'None provided';
//   };

//   // Close modal with Escape key
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') {
//         onClose();
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [onClose]);

//   // Fallback for missing order data
//   if (!order || !order.items || !order.shipping || !order.totals) {
//     return (
//       <div className="order-details-modal" role="dialog" aria-labelledby="modal-title">
//         <div className="modal-content">
//           <span className="close-btn" onClick={onClose} role="button" aria-label="Close modal">×</span>
//           <h3 id="modal-title">Error</h3>
//           <p>Order data is incomplete or missing.</p>
//           <button className="modal-close-btn" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="order-details-modal" role="dialog" aria-labelledby="modal-title">
//       <div className="modal-content">
//         <span
//           className="close-btn"
//           onClick={onClose}
//           role="button"
//           aria-label="Close modal"
//           tabIndex="0"
//           onKeyPress={(e) => e.key === 'Enter' && onClose()}
//         >
//           ×
//         </span>
//         <h3 id="modal-title">Order Details - #{order._id}</h3>
//         <div className="modal-section">
//           <h4>Items</h4>
//           {order.items.length > 0 ? (
//             order.items.map((item) => (
//               <div key={item._id || item.name} className="modal-item">
//                 <img
//                   src={normalizeImageUrl(item.imageUrl)}
//                   alt={item.name || 'Product'}
//                   className="modal-item-image"
//                   onError={(e) => {
//                     console.error(`Image load error for ${item.name}: ${item.imageUrl}`);
//                     e.target.src = PLACEHOLDER_IMAGE;
//                   }}
//                   loading="lazy"
//                 />
//                 <div className="modal-item-details">
//                   <p><strong>{item.name || 'Unknown Item'}</strong></p>
//                   <p>Quantity: {item.quantity || 'N/A'}</p>
//                   <p>Price: ₹{(item.price || 0).toFixed(2)}</p>
//                   <p>Total: ₹{((item.quantity || 0) * (item.price || 0)).toFixed(2)}</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No items found for this order.</p>
//           )}
//         </div>
//         <div className="modal-section">
//           <h4>Shipping Information</h4>
//           <p><strong>Name:</strong> {order.shipping.name || 'N/A'}</p>
//           <p>
//             <strong>Address:</strong>{' '}
//             {order.shipping.address
//               ? `${order.shipping.address}, ${order.shipping.city || ''}, ${order.shipping.postalCode || ''}`
//               : 'N/A'}
//           </p>
//           <p><strong>Phone:</strong> {order.shipping.phone || 'N/A'}</p>
//           <p><strong>Email:</strong> {order.shipping.email || 'N/A'}</p>
//         </div>
//         <div className="modal-section">
//           <h4>Payment Method</h4>
//           <p>
//             <strong>Method:</strong>{' '}
//             {displayPaymentMethod(
//               order.payment?.method,
//               order.payment?.upiId,
//               order.totals?.walletAmountUsed || 0
//             )}
//             {order.payment?.cardLastFour && ` (**** **** **** ${order.payment.cardLastFour})`}
//           </p>
//         </div>
//         <div className="modal-section">
//           <h4>Order Totals</h4>
//           <p><strong>Subtotal:</strong> ₹{(order.totals.subtotal || 0).toFixed(2)}</p>
//           <p><strong>GST (18%):</strong> ₹{(order.totals.gstAmount || 0).toFixed(2)}</p>
//           {order.totals.promoDiscount > 0 && (
//             <p><strong>Promo Discount:</strong> -₹{order.totals.promoDiscount.toFixed(2)}</p>
//           )}
//           {order.totals.walletAmountUsed > 0 && (
//             <p><strong>Wallet Payment:</strong> -₹{order.totals.walletAmountUsed.toFixed(2)}</p>
//           )}
//           <p><strong>Total:</strong> ₹{(order.totals.totalAmount || 0).toFixed(2)}</p>
//           {order.totals.promoCode && <p><strong>Promo Code:</strong> {order.totals.promoCode}</p>}
//         </div>
//         <div className="modal-section">
//           <h4>Status</h4>
//           <p>
//             <strong>Status:</strong>{' '}
//             <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
//               {order.status || 'Unknown'}
//             </span>
//           </p>
//           <p><strong>Order Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
//           {order.status === 'Delivered' && order.deliveredAt && (
//             <p><strong>Delivered On:</strong> {new Date(order.deliveredAt).toLocaleString()}</p>
//           )}
//         </div>
//         {(order.status === 'Return Requested' || order.status === 'Returned') && (
//           <div className="modal-section">
//             <h4>Return Information</h4>
//             <p><strong>Return Reason:</strong> {getReturnReason(order.returnReason)}</p>
//             <p><strong>Additional Details:</strong> {getReturnDetails(order.returnDetails)}</p>
//             <p>
//               <strong>Refund Status:</strong>{' '}
//               {order.returnStatus === 'pending' ? 'Pending' : order.returnStatus === 'approved' ? 'Processed' : 'Unknown'}
//               {order.returnStatus === 'approved' && order.refundedAt && (
//                 <span> (Processed on {new Date(order.refundedAt).toLocaleString()})</span>
//               )}
//             </p>
//           </div>
//         )}
//         <button className="modal-close-btn" onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// };

// OrderDetailsModal.propTypes = {
//   order: PropTypes.shape({
//     _id: PropTypes.string,
//     items: PropTypes.arrayOf(
//       PropTypes.shape({
//         _id: PropTypes.string,
//         name: PropTypes.string,
//         quantity: PropTypes.number,
//         price: PropTypes.number,
//         imageUrl: PropTypes.string,
//       })
//     ),
//     shipping: PropTypes.shape({
//       name: PropTypes.string,
//       address: PropTypes.string,
//       city: PropTypes.string,
//       postalCode: PropTypes.string,
//       phone: PropTypes.string,
//       email: PropTypes.string,
//     }),
//     payment: PropTypes.shape({
//       method: PropTypes.string,
//       upiId: PropTypes.string,
//       cardLastFour: PropTypes.string,
//     }),
//     totals: PropTypes.shape({
//       subtotal: PropTypes.number,
//       gstAmount: PropTypes.number,
//       promoDiscount: PropTypes.number,
//       walletAmountUsed: PropTypes.number,
//       totalAmount: PropTypes.number,
//       promoCode: PropTypes.string,
//     }),
//     status: PropTypes.string,
//     createdAt: PropTypes.string,
//     deliveredAt: PropTypes.string,
//     returnReason: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     returnDetails: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     returnStatus: PropTypes.oneOf(['pending', 'approved', 'rejected', null]),
//     refundedAt: PropTypes.string,
//   }).isRequired,
//   onClose: PropTypes.func.isRequired,
//   apiBase: PropTypes.string.isRequired,
// };

// export default OrderDetailsModal;











import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './OrderDetailsModal.css';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/60?text=No+Image';

const OrderDetailsModal = ({ order, onClose, apiBase }) => {
  // Normalize image URL
  const normalizeImageUrl = (imageUrl) => {
    if (!imageUrl) return PLACEHOLDER_IMAGE;
    const normalized = imageUrl.replace(/^[Uu]ploads\//, '/Uploads/');
    if (normalized.startsWith('http')) return normalized;
    if (!normalized.startsWith('/')) return `/${normalized}`;
    return `${apiBase}${normalized}`;
  };

  // Map payment method to user-friendly name
  const displayPaymentMethod = (method, upiId, walletUsed) => {
    if (method === 'card') return 'Card';
    if (method === 'upi' && upiId) {
      const provider = upiId?.split('@')[1]?.toLowerCase();
      if (provider === 'phonepe') return 'PhonePe';
      if (provider === 'gpay') return 'GPay';
      if (provider === 'paytm') return 'Paytm';
      return 'UPI';
    }
    return method ? method.charAt(0).toUpperCase() + method.slice(1) + (walletUsed > 0 ? ' + Wallet' : '') : 'Unknown';
  };

  // Get status badge class (aligned with Orders.jsx)
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

  // Handle return reason
  const getReturnReason = (returnDetails) => {
    return returnDetails?.reason || 'N/A';
  };

  // Handle return details
  const getReturnDetails = (returnDetails) => {
    return returnDetails?.details || 'None provided';
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fallback for missing order data
  if (!order || !order.items || !order.shipping || !order.totals) {
    return (
      <div className="order-details-modal" role="dialog" aria-labelledby="modal-title">
        <div className="modal-content">
          <span className="close-btn" onClick={onClose} role="button" aria-label="Close modal">×</span>
          <h3 id="modal-title">Error</h3>
          <p>Order data is incomplete or missing.</p>
          <button className="modal-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-modal" role="dialog" aria-labelledby="modal-title">
      <div className="modal-content">
        <span
          className="close-btn"
          onClick={onClose}
          role="button"
          aria-label="Close modal"
          tabIndex="0"
          onKeyPress={(e) => e.key === 'Enter' && onClose()}
        >
          ×
        </span>
        <h3 id="modal-title">Order Details - #{order._id}</h3>
        <div className="modal-section">
          <h4>Items</h4>
          {order.items.length > 0 ? (
            order.items.map((item) => (
              <div key={item._id || item.name} className="modal-item">
                <img
                  src={normalizeImageUrl(item.imageUrl)}
                  alt={item.name || 'Product'}
                  className="modal-item-image"
                  onError={(e) => {
                    console.error(`Image load error for ${item.name}: ${item.imageUrl}`);
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                  loading="lazy"
                />
                <div className="modal-item-details">
                  <p><strong>{item.name || 'Unknown Item'}</strong></p>
                  <p>Quantity: {item.quantity || 'N/A'}</p>
                  <p>Price: ₹{(item.price || 0).toFixed(2)}</p>
                  <p>Total: ₹{((item.quantity || 0) * (item.price || 0)).toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No items found for this order.</p>
          )}
        </div>
        <div className="modal-section">
          <h4>Shipping Information</h4>
          <p><strong>Name:</strong> {order.shipping.name || 'N/A'}</p>
          <p>
            <strong>Address:</strong>{' '}
            {order.shipping.address
              ? `${order.shipping.address}, ${order.shipping.city || ''}, ${order.shipping.postalCode || ''}`
              : 'N/A'}
          </p>
          <p><strong>Phone:</strong> {order.shipping.phone || 'N/A'}</p>
          <p><strong>Email:</strong> {order.shipping.email || 'N/A'}</p>
        </div>
        <div className="modal-section">
          <h4>Payment Method</h4>
          <p>
            <strong>Method:</strong>{' '}
            {displayPaymentMethod(
              order.payment?.method,
              order.payment?.upiId,
              order.totals?.walletAmountUsed || 0
            )}
            {order.payment?.cardLastFour && ` (**** **** **** ${order.payment.cardLastFour})`}
          </p>
        </div>
        <div className="modal-section">
          <h4>Order Totals</h4>
          <p><strong>Subtotal:</strong> ₹{(order.totals.subtotal || 0).toFixed(2)}</p>
          <p><strong>GST (18%):</strong> ₹{(order.totals.gstAmount || 0).toFixed(2)}</p>
          {order.totals.promoDiscount > 0 && (
            <p><strong>Promo Discount:</strong> -₹{order.totals.promoDiscount.toFixed(2)}</p>
          )}
          {order.totals.walletAmountUsed > 0 && (
            <p><strong>Wallet Payment:</strong> -₹{order.totals.walletAmountUsed.toFixed(2)}</p>
          )}
          <p><strong>Total:</strong> ₹{(order.totals.totalAmount || 0).toFixed(2)}</p>
          {order.totals.promoCode && <p><strong>Promo Code:</strong> {order.totals.promoCode}</p>}
        </div>
        <div className="modal-section">
          <h4>Status</h4>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
              {order.status || 'Unknown'}
            </span>
          </p>
          <p><strong>Order Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
          {order.status === 'Delivered' && order.deliveredAt && (
            <p><strong>Delivered On:</strong> {new Date(order.deliveredAt).toLocaleString()}</p>
          )}
        </div>
        {(order.status === 'Return Requested' || order.status === 'Returned') && order.returnDetails?.reason && (
          <div className="modal-section return-details">
            <h4>Return Information</h4>
            <p><strong>Return Reason:</strong> {getReturnReason(order.returnDetails)}</p>
            <p><strong>Additional Details:</strong> {getReturnDetails(order.returnDetails)}</p>
            <p>
              <strong>Refund Status:</strong>{' '}
              {order.refundedAmount > 0 ? `Processed (₹${order.refundedAmount.toFixed(2)})` : 'Pending'}
            </p>
          </div>
        )}
        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

OrderDetailsModal.propTypes = {
  order: PropTypes.shape({
    _id: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.number,
        imageUrl: PropTypes.string,
      })
    ),
    shipping: PropTypes.shape({
      name: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.string,
      postalCode: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
    }),
    payment: PropTypes.shape({
      method: PropTypes.string,
      upiId: PropTypes.string,
      cardLastFour: PropTypes.string,
    }),
    totals: PropTypes.shape({
      subtotal: PropTypes.number,
      gstAmount: PropTypes.number,
      promoDiscount: PropTypes.number,
      walletAmountUsed: PropTypes.number,
      totalAmount: PropTypes.number,
      promoCode: PropTypes.string,
    }),
    status: PropTypes.string,
    createdAt: PropTypes.string,
    deliveredAt: PropTypes.string,
    returnDetails: PropTypes.shape({
      reason: PropTypes.string,
      details: PropTypes.string,
    }),
    refundedAmount: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  apiBase: PropTypes.string.isRequired,
};

export default OrderDetailsModal;