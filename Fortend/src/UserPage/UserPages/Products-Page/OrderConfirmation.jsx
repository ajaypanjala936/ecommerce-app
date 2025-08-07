


// import React, { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
// import { useCart } from '../../../context/CartContext';
// import './OrderConfirmation.css';

// const OrderConfirmation = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { showNotification } = useCart();
//   const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
//   const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/80?text=No+Image';

//   // Redirect if state is missing
//   useEffect(() => {
//     if (!state) {
//       showNotification('No order data found. Please place an order.', 'error');
//       navigate('/cart');
//     } else {
//       showNotification('Order placed successfully!', 'success');
//     }
//   }, [state, navigate, showNotification]);

//   // Default values to prevent errors if state is missing
//   const {
//     items = [],
//     formData = {},
//     subtotal = 0,
//     gstAmount = 0,
//     promoApplied = null,
//     validPromoDiscount = 0,
//     walletAmountUsed = 0,
//     totalAmount = 0,
//     promoCodes = {},
//   } = state || {};

//   // Normalize image URL
//   const normalizeImageUrl = (imageUrl) => {
//     if (!imageUrl || imageUrl === '') return PLACEHOLDER_IMAGE;
//     if (imageUrl.startsWith('http')) return imageUrl;
//     const normalized = imageUrl.replace(/^[Uu]ploads\//, '/Uploads/');
//     if (normalized.startsWith('/')) return `${API_BASE}${normalized}`;
//     return `${API_BASE}/${normalized}`;
//   };

//   const handleContinueShopping = () => {
//     navigate('/');
//   };

//   return (
//     <div className="confirmation-page">
//       <div className="confirmation-header">
//         <div className="buy-checkout-steps">
//           <span className="buy-step buy-active">1. Shipping</span>
//           <span className="buy-step buy-active">2. Payment</span>
//           <span className="buy-step buy-active">3. Confirmation</span>
//         </div>
//         <FaCheckCircle className="success-icon" aria-label="Order confirmed" />
//         <h1>Order Confirmed!</h1>
//         <p>Thank you for your purchase. Your order has been successfully placed.</p>
//       </div>

//       <div className="confirmation-container">
//         <section className="order-details" role="region" aria-labelledby="order-summary-title">
//           <h2 id="order-summary-title" className="section-title">Order Summary</h2>
//           {items.length === 0 ? (
//             <p>No items in order.</p>
//           ) : (
//             <div className="order-items">
//               {items.map((item) => (
//                 <div key={item._id} className="order-item">
//                   <div className="item-image-container">
//                     <img
//                       src={normalizeImageUrl(item.imageUrl)}
//                       alt={item.name}
//                       className="item-image"
//                       onError={(e) => {
//                         e.target.src = PLACEHOLDER_IMAGE;
//                       }}
//                     />
//                   </div>
//                   <div className="item-details">
//                     <h3 className="item-name">{item.name}</h3>
//                     <p className="item-price">
//                       {item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} × {item.quantity}
//                     </p>
//                   </div>
//                   <div className="item-total">{(item.quantity * item.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="order-totals">
//             <div className="total-row">
//               <span>Subtotal</span>
//               <span>{subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
//             </div>
//             <div className="total-row">
//               <span>GST (18%)</span>
//               <span>{gstAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
//             </div>
//             {promoApplied && (
//               <div className="total-row discount">
//                 <span>Promo Discount ({promoCodes[promoApplied]?.label})</span>
//                 <span>-{validPromoDiscount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
//               </div>
//             )}
//             {walletAmountUsed > 0 && (
//               <div className="total-row discount">
//                 <span>Wallet Payment</span>
//                 <span>-{walletAmountUsed.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
//               </div>
//             )}
//             <div className="total-row">
//               <span>Shipping</span>
//               <span>FREE</span>
//             </div>
//             <div className="total-row grand-total">
//               <span>Total</span>
//               <span>{totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
//             </div>
//           </div>
//         </section>

//         <section className="shipping-payment-details" role="region" aria-labelledby="shipping-payment-title">
//           <div className="shipping-info">
//             <h2 id="shipping-payment-title" className="section-title">Shipping Information</h2>
//             <p><strong>Name:</strong> {formData.name || 'N/A'}</p>
//             <p>
//               <strong>Address:</strong> {formData.address || 'N/A'}, {formData.city || 'N/A'}, {formData.postalCode || 'N/A'}
//             </p>
//             <p><strong>Phone:</strong> {formData.phone || 'N/A'}</p>
//             <p><strong>Email:</strong> {formData.email || 'N/A'}</p>
//           </div>

//           <div className="payment-info">
//             <h2 className="section-title">Payment Method</h2>
//             <p>
//               <strong>Method:</strong> {formData.paymentMethod || 'N/A'}
//               {formData.paymentMethod === 'Card' && formData.cardNumber
//                 ? ` (**** **** **** ${formData.cardNumber.slice(-4)})`
//                 : formData.upiId
//                 ? ` (${formData.upiId})`
//                 : ''}
//               {walletAmountUsed > 0 ? ' + Wallet' : ''}
//             </p>
//           </div>
//         </section>
//       </div>

//       <button
//         className="continue-shopping-btn"
//         onClick={handleContinueShopping}
//         aria-label="Continue shopping"
//       >
//         <FaShoppingBag className="btn-icon" /> Continue Shopping
//       </button>
//     </div>
//   );
// };

// export default OrderConfirmation;














import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../../context/CartContext';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useCart();
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/80?text=No+Image';

  // Redirect if state is missing
  useEffect(() => {
    if (!state) {
      showNotification('No order data found. Please place an order.', 'error');
      navigate('/cart');
    } else {
      showNotification('Order placed successfully!', 'success');
    }
  }, [state, navigate, showNotification]);

  // Default values to prevent errors if state is missing
  const {
    items = [],
    formData = {},
    subtotal = 0,
    gstAmount = 0,
    promoApplied = null,
    validPromoDiscount = 0,
    walletAmountUsed = 0,
    totalAmount = 0,
    promoCodes = {},
  } = state || {};

  // Normalize image URL
  const normalizeImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '') return PLACEHOLDER_IMAGE;
    if (imageUrl.startsWith('http')) return imageUrl;
    const normalized = imageUrl.replace(/^[Uu]ploads\//, '/Uploads/');
    if (normalized.startsWith('/')) return `${API_BASE}${normalized}`;
    return `${API_BASE}/${normalized}`;
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="oc-page">
      <div className="oc-header">
        <div className="oc-checkout-steps">
          <span className="oc-step oc-step-active">1. Shipping</span>
          <span className="oc-step oc-step-active">2. Payment</span>
          <span className="oc-step oc-step-active">3. Confirmation</span>
        </div>
        <FaCheckCircle className="oc-success-icon" aria-label="Order confirmed" />
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order has been successfully placed.</p>
      </div>

      <div className="oc-container">
        <section className="oc-order-details" role="region" aria-labelledby="oc-order-summary-title">
          <h2 id="oc-order-summary-title" className="oc-section-title">Order Summary</h2>
          {items.length === 0 ? (
            <p>No items in order.</p>
          ) : (
            <div className="oc-order-items">
              {items.map((item) => (
                <div key={item._id} className="oc-order-item">
                  <div className="oc-item-image-container">
                    <img
                      src={normalizeImageUrl(item.imageUrl)}
                      alt={item.name}
                      className="oc-item-image"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>
                  <div className="oc-item-details">
                    <h3 className="oc-item-name">{item.name}</h3>
                    <p className="oc-item-price">
                      {item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} × {item.quantity}
                    </p>
                  </div>
                  <div className="oc-item-total">{(item.quantity * item.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
                </div>
              ))}
            </div>
          )}

          <div className="oc-order-totals">
            <div className="oc-total-row">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
            </div>
            <div className="oc-total-row">
              <span>GST (18%)</span>
              <span>{gstAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
            </div>
            {promoApplied && (
              <div className="oc-total-row oc-discount">
                <span>Promo Discount ({promoCodes[promoApplied]?.label})</span>
                <span>-{validPromoDiscount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
              </div>
            )}
            {walletAmountUsed > 0 && (
              <div className="oc-total-row oc-discount">
                <span>Wallet Payment</span>
                <span>-{walletAmountUsed.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
              </div>
            )}
            <div className="oc-total-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="oc-total-row oc-grand-total">
              <span>Total</span>
              <span>{totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
            </div>
          </div>
        </section>

        <section className="oc-shipping-payment" role="region" aria-labelledby="oc-shipping-payment-title">
          <div className="oc-shipping-info">
            <h2 id="oc-shipping-payment-title" className="oc-section-title">Shipping Information</h2>
            <p><strong>Name:</strong> {formData.name || 'N/A'}</p>
            <p>
              <strong>Address:</strong> {formData.address || 'N/A'}, {formData.city || 'N/A'}, {formData.postalCode || 'N/A'}
            </p>
            <p><strong>Phone:</strong> {formData.phone || 'N/A'}</p>
            <p><strong>Email:</strong> {formData.email || 'N/A'}</p>
          </div>

          <div className="oc-payment-info">
            <h2 className="oc-section-title">Payment Method</h2>
            <p>
              <strong>Method:</strong> {formData.paymentMethod || 'N/A'}
              {formData.paymentMethod === 'Card' && formData.cardNumber
                ? ` (**** **** **** ${formData.cardNumber.slice(-4)})`
                : formData.upiId
                ? ` (${formData.upiId})`
                : ''}
              {walletAmountUsed > 0 ? ' + Wallet' : ''}
            </p>
          </div>
        </section>
      </div>

      <button
        className="oc-continue-btn"
        onClick={handleContinueShopping}
        aria-label="Continue shopping"
      >
        <FaShoppingBag className="oc-btn-icon" /> Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;