
// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useCart } from '../../../context/CartContext';
// import { useAuth } from '../../../context/AuthContext';
// import { FaCreditCard, FaLock, FaShoppingBag, FaPlus, FaMinus, FaWallet } from 'react-icons/fa';
// import './Buy.css';

// const Buy = () => {
//   const { state } = useLocation();
//   const { showNotification, removeFromCart } = useCart();
//   const { user, token, refreshToken } = useAuth();
//   const navigate = useNavigate();
//   const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
//   const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/80?text=No+Image';

//   useEffect(() => {
//     if (!user || !token) {
//       showNotification('Please log in to place an order', 'error');
//       navigate('/login', { state: { from: '/buy' } });
//     }
//   }, [user, token, navigate, showNotification]);

//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     phone: user?.mobileNumber || '',
//     email: user?.email || '',
//     address: user?.address || '',
//     city: '',
//     postalCode: '',
//     upiId: '',
//     cardNumber: '',
//     expiry: '',
//     cvv: '',
//     paymentMethod: '',
//     promoCode: '',
//     upiProvider: '',
//   });

//   const [promoApplied, setPromoApplied] = useState(null);
//   const [items, setItems] = useState([]);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [useWallet, setUseWallet] = useState(false);
//   const [walletError, setWalletError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditingShipping, setIsEditingShipping] = useState(false);

//   const normalizeImageUrl = (imageUrl) => {
//     if (!imageUrl || imageUrl === '') return PLACEHOLDER_IMAGE;
//     if (imageUrl.startsWith('http')) return imageUrl;
//     const normalized = imageUrl.replace(/^[Uu]ploads\//, '/Uploads/');
//     if (normalized.startsWith('/')) return `${API_BASE}${normalized}`;
//     return `${API_BASE}/${normalized}`;
//   };

//   useEffect(() => {
//     const validateItems = async () => {
//       if (!state?.items?.length) {
//         showNotification('No items to purchase', 'error');
//         navigate('/cart');
//         return;
//       }

//       try {
//         const validItems = [];
//         for (const item of state.items) {
//           if (!item._id) {
//             console.error('Invalid item ID:', item);
//             continue;
//           }
//           const response = await fetch(`${API_BASE}/api/products/${item._id}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           });
//           if (!response.ok) {
//             console.warn(`Product not found: ${item.name} (ID: ${item._id})`);
//             showNotification(`Product not found: ${item.name}`, 'error');
//             continue;
//           }
//           const product = await response.json();
//           validItems.push({
//             itemId: item.itemId,
//             _id: product._id,
//             name: product.name,
//             price: product.price,
//             quantity: Math.min(item.quantity, product.stock),
//             stock: product.stock ?? item.stock ?? 0,
//             imageUrl: normalizeImageUrl(product.imageUrl),
//           });
//         }
//         if (validItems.length === 0) {
//           showNotification('No valid items to purchase', 'error');
//           navigate('/cart');
//           return;
//         }
//         setItems(validItems);
//         console.log('Validated items:', validItems);
//       } catch (err) {
//         console.error('Error validating items:', err.message);
//         showNotification('Failed to validate items', 'error');
//         navigate('/cart');
//       }
//     };

//     if (user && token) {
//       validateItems();
//     }
//   }, [state?.items, user, token, navigate, showNotification, API_BASE]);

//   useEffect(() => {
//     const fetchWallet = async () => {
//       try {
//         const response = await fetch(`${API_BASE}/api/wallet`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || 'Failed to fetch wallet');
//         }
//         const data = await response.json();
//         setWalletBalance(data.balance);
//       } catch (err) {
//         setWalletError(err.message);
//       }
//     };

//     if (user && token) {
//       fetchWallet();
//     }
//   }, [user, token, API_BASE]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let formattedValue = value;

//     if (name === 'cardNumber') {
//       formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
//     } else if (name === 'expiry' && value.length === 2 && !formData.expiry.includes('/')) {
//       formattedValue = value + '/';
//     }

//     setFormData((prev) => ({ ...prev, [name]: formattedValue }));
//   };

//   const handleShippingSave = () => {
//     if (!formData.address || !formData.city || !formData.postalCode) {
//       showNotification('Please fill in all shipping details', 'error');
//       return;
//     }
//     setIsEditingShipping(false);
//     showNotification('Shipping details saved', 'success');
//   };

//   const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
//   const gstRate = 0.18;
//   const gstAmount = subtotal * gstRate;

//   const promoCodes = {
//     SAVE10: { type: 'percentage', value: 0.1, label: '10% Off' },
//     FLAT50: { type: 'fixed', value: 50, label: '₹50 Off' },
//     EXTRA20: { type: 'percentage', value: 0.2, label: '20% Off' },
//     FIRSTORDER: { type: 'fixed', value: 30, label: '₹30 Off (First Order)' },
//   };

//   const promoDiscount = promoApplied && promoCodes[promoApplied]
//     ? promoCodes[promoApplied].type === 'percentage'
//       ? subtotal * promoCodes[promoApplied].value
//       : promoCodes[promoApplied].value
//     : 0;

//   const validPromoDiscount = Math.min(promoDiscount, subtotal);
//   const baseTotal = subtotal + gstAmount - validPromoDiscount;
//   const walletAmountUsed = useWallet ? Math.min(walletBalance, baseTotal) : 0;
//   const totalAmount = baseTotal - walletAmountUsed;

//   const handlePaymentClick = (method) => {
//     setFormData((prev) => ({
//       ...prev,
//       paymentMethod: method,
//       upiId: '',
//       cardNumber: '',
//       expiry: '',
//       cvv: '',
//       upiProvider: method === 'Card' ? '' : method,
//     }));
//   };

//   const handleApplyPromo = () => {
//     const code = formData.promoCode.toUpperCase();
//     if (promoCodes[code]) {
//       setPromoApplied(code);
//       showNotification(`Promo code applied: ${promoCodes[code].label}!`, 'success');
//     } else {
//       setPromoApplied(null);
//       showNotification('Invalid promo code', 'error');
//     }
//   };

//   const handleQuantityChange = (itemId, delta) => {
//     setItems((prevItems) =>
//       prevItems
//         .map((item) => {
//           if (item._id === itemId) {
//             const newQuantity = item.quantity + delta;
//             if (newQuantity < 1) {
//               showNotification('Quantity cannot be less than 1', 'error');
//               return item;
//             }
//             if (item.stock && newQuantity > item.stock) {
//               showNotification(`Only ${item.stock} items in stock`, 'error');
//               return item;
//             }
//             return { ...item, quantity: newQuantity };
//           }
//           return item;
//         })
//         .filter((item) => item.quantity > 0)
//     );
//   };

//   const toggleUseWallet = () => {
//     if (!useWallet && walletBalance <= 0) {
//       showNotification('Your wallet balance is ₹0.00', 'error');
//       return;
//     }
//     setUseWallet(!useWallet);
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();

//     if (isSubmitting) {
//       showNotification('Order is being processed, please wait...', 'info');
//       return;
//     }

//     if (totalAmount > 0 && !formData.paymentMethod) {
//       showNotification('Please select a payment method', 'error');
//       return;
//     }
//     if (totalAmount > 0 && ['GPay', 'PhonePe', 'Paytm'].includes(formData.paymentMethod) && !formData.upiId) {
//       showNotification('Please enter your UPI ID', 'error');
//       return;
//     }
//     if (totalAmount > 0 && formData.paymentMethod === 'Card') {
//       if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
//         showNotification('Please enter a valid 16-digit card number', 'error');
//         return;
//       }
//       if (!formData.expiry || !formData.expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
//         showNotification('Please enter a valid expiry date (MM/YY)', 'error');
//         return;
//       }
//       if (!formData.cvv || formData.cvv.length < 3) {
//         showNotification('Please enter a valid CVV', 'error');
//         return;
//       }
//     }
//     if (useWallet && walletAmountUsed > walletBalance) {
//       showNotification('Insufficient wallet balance', 'error');
//       return;
//     }
//     if (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.city || !formData.postalCode) {
//       showNotification('Please fill in all shipping information', 'error');
//       return;
//     }
//     if (!items.length) {
//       showNotification('Your cart is empty', 'error');
//       return;
//     }
//     if (!user?.id) {
//       showNotification('User authentication failed', 'error');
//       navigate('/login');
//       return;
//     }
//     if (items.some((item) => !item._id)) {
//       showNotification('Some items are missing product IDs', 'error');
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       showNotification('Processing your order...', 'info');

//       try {
//         await refreshToken();
//         console.log('Token refreshed before placing order');
//       } catch (err) {
//         console.error('Error refreshing token before order:', err.message);
//         throw new Error('Failed to refresh session. Please re-login.');
//       }

//       const itemsWithFullUrls = items.map((item) => {
//         if (!item._id || !item.name || !item.price || !item.quantity) {
//           console.error('Invalid item detected:', item);
//           throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
//         }
//         return {
//           itemId: item.itemId,
//           _id: item._id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           stock: item.stock ?? 0,
//           imageUrl: normalizeImageUrl(item.imageUrl),
//         };
//       });

//       const backendPaymentMethod = ['GPay', 'PhonePe', 'Paytm'].includes(formData.paymentMethod)
//         ? 'upi'
//         : formData.paymentMethod.toLowerCase();

//       const orderData = {
//         items: itemsWithFullUrls,
//         formData: {
//           name: formData.name,
//           phone: formData.phone,
//           email: formData.email,
//           address: formData.address,
//           city: formData.city,
//           postalCode: formData.postalCode,
//           paymentMethod: totalAmount > 0 ? backendPaymentMethod : 'wallet',
//           upiId: totalAmount > 0 ? formData.upiId || '' : '',
//           cardNumber: totalAmount > 0 ? formData.cardNumber || '' : '',
//           upiProvider: totalAmount > 0 ? formData.upiProvider || '' : '',
//         },
//         subtotal,
//         gstAmount,
//         promoApplied,
//         validPromoDiscount,
//         walletAmountUsed,
//         baseTotal,
//         totalAmount,
//         promoCodes,
//       };

//       console.log('Order data to send:', JSON.stringify(orderData, null, 2));

//       if (!orderData.items.every(item => item._id && item.name && typeof item.price === 'number' && item.quantity > 0)) {
//         console.error('Invalid items in orderData:', orderData.items);
//         throw new Error('Order contains invalid item data');
//       }

//       const response = await fetch(`${API_BASE}/api/orders/send-confirmation`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(orderData),
//       });

//       if (!response.ok) {
//         let errorMessage = `Failed to process order: ${response.status} ${response.statusText}`;
//         const contentType = response.headers.get('content-type');
//         if (contentType?.includes('application/json')) {
//           const errorData = await response.json();
//           errorMessage = errorData.error || errorMessage;
//         } else {
//           const text = await response.text();
//           console.error('Non-JSON response from order API:', text.slice(0, 100));
//           errorMessage = 'Server returned invalid response';
//         }
//         throw new Error(errorMessage);
//       }

//       const result = await response.json();
//       console.log('Order API success response:', result);
//       showNotification(`Order placed successfully for: ${result.productNames}`, 'success');

//       // Remove only purchased items from cart
//       console.log('Removing purchased items:', itemsWithFullUrls.map((item) => item.itemId));
//       for (const item of itemsWithFullUrls) {
//         try {
//           await removeFromCart(item.itemId);
//           console.log(`Removed item from cart: ${item.itemId}`);
//         } catch (err) {
//           console.error(`Failed to remove item ${item.itemId}:`, err.message);
//           showNotification(`Failed to remove item ${item.name} from cart`, 'error');
//         }
//       }

//       window.dispatchEvent(new Event('orderPlaced'));
//       navigate('/order-confirmation', { state: orderData });
//     } catch (error) {
//       console.error('Order error:', error.message, error.stack);
//       showNotification(`Failed to place order. Please try again or contact support.`, 'error');
//     } finally {
//       setIsSubmitting(false);
//       if (totalAmount > 0 && ['GPay', 'PhonePe', 'Paytm'].includes(formData.paymentMethod)) {
//         setFormData((prev) => ({ ...prev, upiId: '' }));
//       }
//     }
//   };

//   if (!user || !token) return null;

//   return (
//     <div className="cart-page">
//       <div className="cart-header">
//         <h1 className="cart-title">
//           <FaShoppingBag className="cart-title-icon" /> Checkout
//         </h1>
//         <div className="cart-steps">
//           <span className="cart-step cart-step-active">1. Shipping</span>
//           <span className="cart-step cart-step-active">2. Payment</span>
//           <span className="cart-step">3. Confirmation</span>
//         </div>
//       </div>

//       <div className="cart-container">
//         <div className="cart-order-summary">
//           <h2 className="cart-summary-title">Your Order</h2>
//           <div className="cart-order-items">
//             {items.length === 0 ? (
//               <div className="cart-empty-cart">
//                 <p>Loading items...</p>
//                 <button
//                   className="cart-continue-shopping"
//                   onClick={() => navigate('/cart')}
//                 >
//                   Return to Cart
//                 </button>
//               </div>
//             ) : (
//               <>
//                 {items.map((item) => (
//                   <div key={item._id} className="cart-order-item">
//                     <div className="cart-item-image-container">
//                       <img
//                         src={item.imageUrl}
//                         alt={item.name}
//                         className="cart-item-image"
//                         onError={(e) => {
//                           console.error('Image load error:', item.imageUrl);
//                           e.target.src = PLACEHOLDER_IMAGE;
//                         }}
//                       />
//                     </div>
//                     <div className="cart-item-details">
//                       <h3 className="cart-item-name">{item.name}</h3>
//                       <p className="cart-item-price">{item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} each</p>
//                       <div className="cart-quantity-controls">
//                         <button
//                           className="cart-quantity-btn"
//                           onClick={() => handleQuantityChange(item._id, -1)}
//                           aria-label={`Decrease quantity of ${item.name}`}
//                         >
//                           <FaMinus />
//                         </button>
//                         <span className="cart-quantity-value">{item.quantity}</span>
//                         <button
//                           className="cart-quantity-btn"
//                           onClick={() => handleQuantityChange(item._id, 1)}
//                           aria-label={`Increase quantity of ${item.name}`}
//                         >
//                           <FaPlus />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="cart-item-total">{(item.quantity * item.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
//                   </div>
//                 ))}
//               </>
//             )}
//           </div>

//           <div className="cart-order-totals">
//             <div className="cart-total-row">
//               <span>Subtotal</span>
//               <span>{subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
//             </div>
//             <div className="cart-total-row">
//               <span>GST (18%)</span>
//               <span>{gstAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
//             </div>
//             {promoApplied && (
//               <div className="cart-total-row cart-discount">
//                 <span>Promo Discount ({promoCodes[promoApplied].label})</span>
//                 <span>-{validPromoDiscount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
//               </div>
//             )}
//             <div className="cart-total-row">
//               <span>Shipping</span>
//               <span>FREE</span>
//             </div>
//             <div className="cart-total-row cart-wallet">
//               <span>
//                 Wallet Balance: {walletBalance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
//                 <label className="cart-wallet-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={useWallet}
//                     onChange={toggleUseWallet}
//                     disabled={walletBalance <= 0}
//                   />
//                   Use Wallet
//                 </label>
//               </span>
//               <span>{walletAmountUsed > 0 ? `-${walletAmountUsed.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}` : '-'}</span>
//             </div>
//             <div className="cart-total-row">
//               <span>Total (Before Wallet)</span>
//               <span>{baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
//             </div>
//             <div className="cart-total-row cart-grand-total">
//               <span>Amount Payable</span>
//               <span>{totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
//             </div>
//             {walletError && <p className="cart-error-message">{walletError}</p>}
//             {useWallet && totalAmount <= 0 && (
//               <p className="cart-wallet-sufficient">
//                 Your wallet balance covers the entire order. No additional payment method required.
//               </p>
//             )}
//           </div>

//           <div className="cart-promo-code-section">
//             <div className="cart-form-group">
//               <label htmlFor="promoCode">Promo Code</label>
//               <div className="cart-promo-input-group">
//                 <input
//                   id="promoCode"
//                   name="promoCode"
//                   type="text"
//                   placeholder="Enter promo code"
//                   value={formData.promoCode}
//                   onChange={handleChange}
//                   className={promoApplied ? 'cart-promo-success' : ''}
//                 />
//                 <button
//                   type="button"
//                   className="cart-apply-promo-btn"
//                   onClick={handleApplyPromo}
//                   disabled={!formData.promoCode}
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="cart-shipping-details">
//           <h2 className="cart-section-title">Shipping Details</h2>
//           {isEditingShipping ? (
//             <div className="cart-form-grid">
//               <div className="cart-form-group">
//                 <label htmlFor="name">Full Name</label>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   placeholder="John Doe"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="cart-form-group">
//                 <label htmlFor="phone">Phone Number</label>
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   placeholder="+1 234 567 8900"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="cart-form-group">
//                 <label htmlFor="email">Email Address</label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="john@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="cart-form-group cart-full-width">
//                 <label htmlFor="address">Street Address</label>
//                 <input
//                   id="address"
//                   name="address"
//                   type="text"
//                   placeholder="123 Main St"
//                   value={formData.address}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="cart-form-group">
//                 <label htmlFor="city">City</label>
//                 <input
//                   id="city"
//                   name="city"
//                   type="text"
//                   placeholder="New York"
//                   value={formData.city}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="cart-form-group">
//                 <label htmlFor="postalCode">Postal Code</label>
//                 <input
//                   id="postalCode"
//                   name="postalCode"
//                   type="text"
//                   placeholder="10001"
//                   value={formData.postalCode}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="cart-form-group cart-full-width">
//                 <button
//                   type="button"
//                   className="cart-save-btn"
//                   onClick={handleShippingSave}
//                 >
//                   Save Shipping Details
//                 </button>
//                 <button
//                   type="button"
//                   className="cart-cancel-btn"
//                   onClick={() => setIsEditingShipping(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="cart-shipping-display">
//               <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>
//               <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
//               <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
//               <p><strong>Address:</strong> {formData.address || 'Not provided'}</p>
//               <p><strong>City:</strong> {formData.city || 'Not provided'}</p>
//               <p><strong>Postal Code:</strong> {formData.postalCode || 'Not provided'}</p>
//               <button
//                 type="button"
//                 className="cart-toggle-btn"
//                 onClick={() => setIsEditingShipping(true)}
//               >
//                 Change Shipping Details
//               </button>
//             </div>
//           )}
//         </div>

//         <form className="cart-checkout-form" onSubmit={handlePlaceOrder}>
//           <section className="cart-form-section">
//             <h2 className="cart-section-title">Payment Method</h2>
//             {useWallet && totalAmount <= 0 ? (
//               <p className="cart-wallet-sufficient">
//                 Your order is fully covered by your wallet balance. No additional payment method is required.
//               </p>
//             ) : (
//               <>
//                 <div className="cart-payment-methods">
//                   {['Card', 'GPay', 'PhonePe', 'Paytm'].map((method) => (
//                     <div
//                       key={method}
//                       className={`cart-payment-method ${formData.paymentMethod === method ? 'cart-selected' : ''}`}
//                       onClick={() => handlePaymentClick(method)}
//                       role="button"
//                       aria-label={`Select ${method} payment method`}
//                       tabIndex={0}
//                       onKeyDown={(e) => e.key === 'Enter' && handlePaymentClick(method)}
//                     >
//                       <div className="cart-method-icon">
//                         {method === 'Card' ? (
//                           <img width="35" height="35" src="https://img.icons8.com/emoji/35/credit-card-emoji.png" alt="credit-card-emoji" />
//                         ) : (
//                           <img
//                             src={
//                               method === 'GPay'
//                                 ? 'https://img.icons8.com/color/48/google-pay.png'
//                                 : method === 'PhonePe'
//                                 ? 'https://img.icons8.com/color/48/phone-pe.png'
//                                 : 'https://img.icons8.com/color/48/paytm.png'
//                             }
//                             alt={method}
//                             className="cart-method-img"
//                           />
//                         )}
//                       </div>
//                       <span className="cart-method-name">{method}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {['GPay', 'PhonePe', 'Paytm'].includes(formData.paymentMethod) && (
//                   <div className="cart-form-group">
//                     <label htmlFor="upiId">UPI ID</label>
//                     <input
//                       id="upiId"
//                       name="upiId"
//                       type="text"
//                       placeholder="yourname@upi"
//                       value={formData.upiId}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 )}

//                 {formData.paymentMethod === 'Card' && (
//                   <>
//                     <div className="cart-form-group">
//                       <label htmlFor="cardNumber">Card Number</label>
//                       <input
//                         id="cardNumber"
//                         name="cardNumber"
//                         type="text"
//                         placeholder="1234 5678 9012 3456"
//                         value={formData.cardNumber}
//                         onChange={handleChange}
//                         maxLength={19}
//                         required
//                       />
//                     </div>

//                     <div className="cart-card-details">
//                       <div className="cart-form-group">
//                         <label htmlFor="expiry">Expiry Date</label>
//                         <input
//                           id="expiry"
//                           name="expiry"
//                           type="text"
//                           placeholder="MM/YY"
//                           value={formData.expiry}
//                           onChange={handleChange}
//                           maxLength={5}
//                           required
//                         />
//                       </div>

//                       <div className="cart-form-group">
//                         <label htmlFor="cvv">CVV</label>
//                         <input
//                           id="cvv"
//                           name="cvv"
//                           type="password"
//                           placeholder="•••"
//                           value={formData.cvv}
//                           onChange={handleChange}
//                           maxLength={4}
//                           required
//                         />
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </>
//             )}
//           </section>

//           <div className="cart-security-notice">
//             <FaLock className="cart-lock-icon" />
//             <span>Your payment information is encrypted and secure</span>
//           </div>

//           <button
//             type="submit"
//             className="cart-place-order-btn"
//             disabled={items.length === 0 || isSubmitting}
//           >
//             {isSubmitting ? 'Processing...' : `Place Order - ${totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Buy;









import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { FaCreditCard, FaLock, FaShoppingBag, FaPlus, FaMinus, FaWallet } from 'react-icons/fa';
import './Buy.css';

const Buy = () => {
  const { state } = useLocation();
  const { showNotification, removeFromCart } = useCart();
  const { user, token, refreshToken } = useAuth();
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/80?text=No+Image';

  useEffect(() => {
    if (!user || !token) {
      showNotification('Please log in to place an order', 'error');
      navigate('/login', { state: { from: '/buy' } });
    }
  }, [user, token, navigate, showNotification]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.mobileNumber || '',
    email: user?.email || '',
    address: user?.address || '',
    city: '',
    postalCode: '',
    upiId: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    paymentMethod: '',
    promoCode: '',
    upiProvider: '',
  });

  const [promoApplied, setPromoApplied] = useState(null);
  const [items, setItems] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingShipping, setIsEditingShipping] = useState(false);

  const normalizeImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '') return PLACEHOLDER_IMAGE;
    if (imageUrl.startsWith('http')) return imageUrl;
    const normalized = imageUrl.replace(/^[Uu]ploads\//, '/Uploads/');
    if (normalized.startsWith('/')) return `${API_BASE}${normalized}`;
    return `${API_BASE}/${normalized}`;
  };

  useEffect(() => {
    const validateItems = async () => {
      if (!state?.items?.length) {
        showNotification('No items to purchase', 'error');
        navigate('/cart');
        return;
      }

      try {
        const validItems = [];
        for (const item of state.items) {
          if (!item._id) {
            console.error('Invalid item ID:', item);
            continue;
          }
          const response = await fetch(`${API_BASE}/api/products/${item._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            console.warn(`Product not found: ${item.name} (ID: ${item._id})`);
            showNotification(`Product not found: ${item.name}`, 'error');
            continue;
          }
          const product = await response.json();
          validItems.push({
            itemId: item.itemId,
            _id: product._id,
            name: product.name,
            price: product.price,
            quantity: Math.min(item.quantity, product.stock),
            stock: product.stock ?? item.stock ?? 0,
            imageUrl: normalizeImageUrl(product.imageUrl),
          });
        }
        if (validItems.length === 0) {
          showNotification('No valid items to purchase', 'error');
          navigate('/cart');
          return;
        }
        setItems(validItems);
        console.log('Validated items:', validItems);
      } catch (err) {
        console.error('Error validating items:', err.message);
        showNotification('Failed to validate items', 'error');
        navigate('/cart');
      }
    };

    if (user && token) {
      validateItems();
    }
  }, [state?.items, user, token, navigate, showNotification, API_BASE]);

  useEffect(() => {
    const fetchWallet = async () => {
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
      } catch (err) {
        setWalletError(err.message);
      }
    };

    if (user && token) {
      fetchWallet();
    }
  }, [user, token, API_BASE]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiry' && value.length === 2 && !formData.expiry.includes('/')) {
      formattedValue = value + '/';
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleShippingSave = () => {
    if (!formData.address || !formData.city || !formData.postalCode) {
      showNotification('Please fill in all shipping details', 'error');
      return;
    }
    setIsEditingShipping(false);
    showNotification('Shipping details saved', 'success');
  };

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const gstRate = 0.18;
  const gstAmount = subtotal * gstRate;

  const promoCodes = {
    SAVE10: { type: 'percentage', value: 0.1, label: '10% Off' },
    FLAT50: { type: 'fixed', value: 50, label: '₹50 Off' },
    EXTRA20: { type: 'percentage', value: 0.2, label: '20% Off' },
    FIRSTORDER: { type: 'fixed', value: 30, label: '₹30 Off (First Order)' },
  };

  const promoDiscount = promoApplied && promoCodes[promoApplied]
    ? promoCodes[promoApplied].type === 'percentage'
      ? subtotal * promoCodes[promoApplied].value
      : promoCodes[promoApplied].value
    : 0;

  const validPromoDiscount = Math.min(promoDiscount, subtotal);
  const baseTotal = subtotal + gstAmount - validPromoDiscount;
  const walletAmountUsed = useWallet ? Math.min(walletBalance, baseTotal) : 0;
  const totalAmount = baseTotal - walletAmountUsed;

  const handlePaymentClick = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
      upiId: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      upiProvider: method === 'Card' ? '' : method,
    }));
  };

  const handleApplyPromo = () => {
    const code = formData.promoCode.toUpperCase();
    if (promoCodes[code]) {
      setPromoApplied(code);
      showNotification(`Promo code applied: ${promoCodes[code].label}!`, 'success');
    } else {
      setPromoApplied(null);
      showNotification('Invalid promo code', 'error');
    }
  };

  const handleQuantityChange = (itemId, delta) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item._id === itemId) {
            const newQuantity = item.quantity + delta;
            if (newQuantity < 1) {
              showNotification('Quantity cannot be less than 1', 'error');
              return item;
            }
            if (item.stock && newQuantity > item.stock) {
              showNotification(`Only ${item.stock} items in stock`, 'error');
              return item;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleUseWallet = () => {
    if (!useWallet && walletBalance <= 0) {
      showNotification('Your wallet balance is ₹0.00', 'error');
      return;
    }
    setUseWallet(!useWallet);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      showNotification('Order is being processed, please wait...', 'info');
      return;
    }

    if (totalAmount > 0 && !formData.paymentMethod) {
      showNotification('Please select a payment method', 'error');
      return;
    }
    if (totalAmount > 0 && ['GPay', 'PhonePe', 'Paytm'].includes(formData.paymentMethod) && !formData.upiId) {
      showNotification('Please enter your UPI ID', 'error');
      return;
    }
    if (totalAmount > 0 && formData.paymentMethod === 'Card') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
        showNotification('Please enter a valid 16-digit card number', 'error');
        return;
      }
      if (!formData.expiry || !formData.expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
        showNotification('Please enter a valid expiry date (MM/YY)', 'error');
        return;
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        showNotification('Please enter a valid CVV', 'error');
        return;
      }
    }
    if (useWallet && walletAmountUsed > walletBalance) {
      showNotification('Insufficient wallet balance', 'error');
      return;
    }
    if (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.city || !formData.postalCode) {
      showNotification('Please fill in all shipping information', 'error');
      return;
    }
    if (!items.length) {
      showNotification('Your cart is empty', 'error');
      return;
    }
    if (!user?.id) {
      showNotification('User authentication failed', 'error');
      navigate('/login');
      return;
    }
    if (items.some((item) => !item._id)) {
      showNotification('Some items are missing product IDs', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      showNotification('Processing your order...', 'info');

      try {
        await refreshToken();
        console.log('Token refreshed before placing order');
      } catch (err) {
        console.error('Error refreshing token before order:', err.message);
        throw new Error('Failed to refresh session. Please re-login.');
      }

      const itemsWithFullUrls = items.map((item) => {
        if (!item._id || !item.name || !item.price || !item.quantity) {
          console.error('Invalid item detected:', item);
          throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
        }
        return {
          itemId: item.itemId,
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          stock: item.stock ?? 0,
          imageUrl: normalizeImageUrl(item.imageUrl),
        };
      });

      const backendPaymentMethod = ['GPay', 'PhonePe', 'Paytm'].includes(formData.paymentMethod)
        ? 'upi'
        : formData.paymentMethod.toLowerCase();

      const orderData = {
        items: itemsWithFullUrls,
        formData: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          paymentMethod: totalAmount > 0 ? backendPaymentMethod : 'wallet',
          upiId: totalAmount > 0 ? formData.upiId || '' : '',
          cardNumber: totalAmount > 0 ? formData.cardNumber || '' : '',
          upiProvider: totalAmount > 0 ? formData.upiProvider || '' : '',
        },
        subtotal,
        gstAmount,
        promoApplied,
        validPromoDiscount,
        walletAmountUsed,
        baseTotal,
        totalAmount,
        promoCodes,
      };

      console.log('Order data to send:', JSON.stringify(orderData, null, 2));

      if (!orderData.items.every(item => item._id && item.name && typeof item.price === 'number' && item.quantity > 0)) {
        console.error('Invalid items in orderData:', orderData.items);
        throw new Error('Order contains invalid item data');
      }

      const response = await fetch(`${API_BASE}/api/orders/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        let errorMessage = `Failed to process order: ${response.status} ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          const text = await response.text();
          console.error('Non-JSON response from order API:', text.slice(0, 100));
          errorMessage = 'Server returned invalid response';
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Order API success response:', result);
      showNotification(`Order placed successfully for: ${result.productNames}`, 'success');

      // Remove only purchased items from cart
      console.log('Removing purchased items:', itemsWithFullUrls.map((item) => item.itemId));
      for (const item of itemsWithFullUrls) {
        try {
          await removeFromCart(item.itemId);
          console.log(`Removed item from cart: ${item.itemId}`);
        } catch (err) {
          console.error(`Failed to remove item ${item.itemId}:`, err.message);
          showNotification(`Failed to remove item ${item.name} from cart`, 'error');
        }
      }

      window.dispatchEvent(new Event('orderPlaced'));
      navigate('/order-confirmation', { state: orderData });
    } catch (error) {
      console.error('Order error:', error.message, error.stack);
      showNotification(`Failed to place order. Please try again or contact support.`, 'error');
    } finally {
      setIsSubmitting(false);
      if (totalAmount > 0 && ['GPay', 'PhonePe', 'Paytm'].includes(formData.paymentMethod)) {
        setFormData((prev) => ({ ...prev, upiId: '' }));
      }
    }
  };

  if (!user || !token) return null;

  return (
    <div className="buy-page">
      <div className="buy-header">
        <h1 className="buy-title">
          <FaShoppingBag className="buy-title-icon" /> Checkout
        </h1>
        <div className="buy-steps">
          <span className="buy-step buy-step-active">1. Shipping</span>
          <span className="buy-step buy-step-active">2. Payment</span>
          <span className="buy-step">3. Confirmation</span>
        </div>
      </div>

      <div className="buy-container">
        <div className="buy-order-summary">
          <h2 className="buy-summary-title">Your Order</h2>
          <div className="buy-order-items">
            {items.length === 0 ? (
              <div className="buy-empty-cart">
                <p>Loading items...</p>
                <button
                  className="buy-continue-shopping"
                  onClick={() => navigate('/cart')}
                >
                  Return to Cart
                </button>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item._id} className="buy-order-item">
                    <div className="buy-item-image-container">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="buy-item-image"
                        onError={(e) => {
                          console.error('Image load error:', item.imageUrl);
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>
                    <div className="buy-item-details">
                      <h3 className="buy-item-name">{item.name}</h3>
                      <p className="buy-item-price">{item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} each</p>
                      <div className="buy-quantity-controls">
                        <button
                          className="buy-quantity-btn"
                          onClick={() => handleQuantityChange(item._id, -1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <FaMinus />
                        </button>
                        <span className="buy-quantity-value">{item.quantity}</span>
                        <button
                          className="buy-quantity-btn"
                          onClick={() => handleQuantityChange(item._id, 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    <div className="buy-item-total">{(item.quantity * item.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="buy-order-totals">
            <div className="buy-total-row">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
            </div>
            <div className="buy-total-row">
              <span>GST (18%)</span>
              <span>{gstAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
            </div>
            {promoApplied && (
              <div className="buy-total-row buy-discount">
                <span>Promo Discount ({promoCodes[promoApplied].label})</span>
                <span>-{validPromoDiscount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
              </div>
            )}
            <div className="buy-total-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="buy-total-row buy-wallet">
              <span>
                Wallet Balance: {walletBalance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                <label className="buy-wallet-checkbox">
                  <input
                    type="checkbox"
                    checked={useWallet}
                    onChange={toggleUseWallet}
                    disabled={walletBalance <= 0}
                  />
                  Use Wallet
                </label>
              </span>
              <span>{walletAmountUsed > 0 ? `-${walletAmountUsed.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}` : '-'}</span>
            </div>
            <div className="buy-total-row">
              <span>Total (Before Wallet)</span>
              <span>{baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
            </div>
            <div className="buy-total-row buy-grand-total">
              <span>Amount Payable</span>
              <span>{totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
            </div>
            {walletError && <p className="buy-error-message">{walletError}</p>}
            {useWallet && totalAmount <= 0 && (
              <p className="buy-wallet-sufficient">
                Your wallet balance covers the entire order. No additional payment method required.
              </p>
            )}
          </div>

          <div className="buy-promo-code-section">
            <div className="buy-form-group">
              <label htmlFor="promoCode">Promo Code</label>
              <div className="buy-promo-input-group">
                <input
                  id="promoCode"
                  name="promoCode"
                  type="text"
                  placeholder="Enter promo code"
                  value={formData.promoCode}
                  onChange={handleChange}
                  className={promoApplied ? 'buy-promo-success' : ''}
                />
                <button
                  type="button"
                  className="buy-apply-promo-btn"
                  onClick={handleApplyPromo}
                  disabled={!formData.promoCode}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="buy-shipping-details">
          <h2 className="buy-section-title">Shipping Details</h2>
          {isEditingShipping ? (
            <div className="buy-form-grid">
              <div className="buy-form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="buy-form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="buy-form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="buy-form-group buy-full-width">
                <label htmlFor="address">Street Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="buy-form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="New York"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="buy-form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  placeholder="10001"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="buy-form-group buy-full-width">
                <button
                  type="button"
                  className="buy-save-btn"
                  onClick={handleShippingSave}
                >
                  Save Shipping Details
                </button>
                <button
                  type="button"
                  className="buy-cancel-btn"
                  onClick={() => setIsEditingShipping(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="buy-shipping-display">
              <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>
              <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
              <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
              <p><strong>Address:</strong> {formData.address || 'Not provided'}</p>
              <p><strong>City:</strong> {formData.city || 'Not provided'}</p>
              <p><strong>Postal Code:</strong> {formData.postalCode || 'Not provided'}</p>
              <button
                type="button"
                className="buy-toggle-btn"
                onClick={() => setIsEditingShipping(true)}
              >
                Change Shipping Details
              </button>
            </div>
          )}
        </div>

        <form className="buy-checkout-form" onSubmit={handlePlaceOrder}>
          <section className="buy-form-section">
            <h2 className="buy-section-title">Payment Method</h2>
            {useWallet && totalAmount <= 0 ? (
              <p className="buy-wallet-sufficient">
                Your order is fully covered by your wallet balance. No additional payment method is required.
              </p>
            ) : (
              <>
                <div className="buy-payment-methods">
                  {['Card', 'GPay', 'PhonePe', 'Paytm'].map((method) => (
                    <div
                      key={method}
                      className={`buy-payment-method ${formData.paymentMethod === method ? 'buy-selected' : ''}`}
                      onClick={() => handlePaymentClick(method)}
                      role="button"
                      aria-label={`Select ${method} payment method`}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handlePaymentClick(method)}
                    >
                      <div className="buy-method-icon">
                        {method === 'Card' ? (
                          <img width="35" height="35" src="https://img.icons8.com/emoji/35/credit-card-emoji.png" alt="credit-card-emoji" />
                        ) : (
                          <img
                            src={
                              method === 'GPay'
                                ? 'https://img.icons8.com/color/48/google-pay.png'
                                : method === 'PhonePe'
                                ? 'https://img.icons8.com/color/48/phone-pe.png'
                                : 'https://img.icons8.com/color/48/paytm.png'
                            }
                            alt={method}
                            className="buy-method-img"
                          />
                        )}
                      </div>
                      <span className="buy-method-name">{method}</span>
                    </div>
                  ))}
                </div>

                {['GPay', 'PhonePe', 'Paytm'].includes(formData.paymentMethod) && (
                  <div className="buy-form-group">
                    <label htmlFor="upiId">UPI ID</label>
                    <input
                      id="upiId"
                      name="upiId"
                      type="text"
                      placeholder="yourname@upi"
                      value={formData.upiId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                {formData.paymentMethod === 'Card' && (
                  <>
                    <div className="buy-form-group">
                      <label htmlFor="cardNumber">Card Number</label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="buy-card-details">
                      <div className="buy-form-group">
                        <label htmlFor="expiry">Expiry Date</label>
                        <input
                          id="expiry"
                          name="expiry"
                          type="text"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleChange}
                          maxLength={5}
                          required
                        />
                      </div>

                      <div className="buy-form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input
                          id="cvv"
                          name="cvv"
                          type="password"
                          placeholder="•••"
                          value={formData.cvv}
                          onChange={handleChange}
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </section>

          <div className="buy-security-notice">
            <FaLock className="buy-lock-icon" />
            <span>Your payment information is encrypted and secure</span>
          </div>

          <button
            type="submit"
            className="buy-place-order-btn"
            disabled={items.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : `Place Order - ${totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Buy;