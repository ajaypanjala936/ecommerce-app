

// import React, { useEffect } from 'react';
// import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { FiShoppingCart, FiAlertCircle, FiLogIn, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
// import './Cart.css';

// const Cart = () => {
//   const {
//     cart,
//     isLoading,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     showNotification,
//     notification,
//     calculateTotal,
//   } = useCart();
  
//   const { user, token } = useAuth();
//   const navigate = useNavigate();
//   const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
//   const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/80?text=No+Image';

//   useEffect(() => {
//     console.log('Cart.jsx rendered with cart:', {
//       itemCount: cart.length,
//       items: cart.map(item => ({
//         itemId: item.itemId,
//         productId: item._id,
//         name: item.name,
//         quantity: item.quantity,
//       })),
//     });
//   }, [cart]);

//   const handleBuySingleItem = (item) => {
//     if (!item.itemId || !item._id) {
//       console.error('Invalid item for buy:', item);
//       showNotification('Invalid item', 'error');
//       return;
//     }
//     const stock = item.product?.stock ?? item.stock ?? 0;
//     if (stock < item.quantity) {
//       showNotification(`${item.name} has insufficient stock`, 'error');
//       return;
//     }
//     const buyItem = {
//       itemId: item.itemId, // Cart item ID
//       _id: item._id, // Product ID
//       name: item.name,
//       price: item.price,
//       quantity: item.quantity,
//       stock,
//       imageUrl: item.imageUrl || '/Uploads/placeholder.jpg',
//     };
//     console.log('Buying single item:', buyItem);
//     navigate('/buy', { state: { items: [buyItem] } });
//   };

//   const handleBuyAll = () => {
//     if (cart.length === 0) {
//       showNotification('Cart is empty', 'error');
//       return;
//     }
    
//     const invalidItems = cart.filter(item => !item.itemId || !item._id);
//     if (invalidItems.length > 0) {
//       console.error('Invalid items in cart:', invalidItems);
//       showNotification('Some cart items are invalid', 'error');
//       return;
//     }

//     const insufficientStockItem = cart.find(item => (item.product?.stock ?? item.stock ?? 0) < item.quantity);
//     if (insufficientStockItem) {
//       showNotification(`${insufficientStockItem.name} has insufficient stock`, 'error');
//       return;
//     }
    
//     const buyItems = cart.map(item => ({
//       itemId: item.itemId, // Cart item ID
//       _id: item._id, // Product ID
//       name: item.name,
//       price: item.price,
//       quantity: item.quantity,
//       stock: item.product?.stock ?? item.stock ?? 0,
//       imageUrl: item.imageUrl || '/Uploads/placeholder.jpg',
//     }));
//     console.log('Buying all items:', buyItems);
//     navigate('/buy', { state: { items: buyItems } });
//   };

//   const handleQuantityChange = async (itemId, amount) => {
//     if (!itemId) {
//       console.error('Invalid itemId for quantity change:', itemId);
//       showNotification('Invalid item', 'error');
//       return;
//     }

//     const item = cart.find(i => i.itemId === itemId);
//     if (!item) {
//       console.error('Item not found in cart:', itemId);
//       showNotification('Item not found', 'error');
//       return;
//     }

//     const newQuantity = item.quantity + amount;
//     if (newQuantity < 1) {
//       showNotification('Quantity cannot be less than 1', 'error');
//       return;
//     }
    
//     const stock = item.product?.stock ?? item.stock ?? 0;
//     if (stock < newQuantity) {
//       showNotification(`Only ${stock} ${item.name} in stock`, 'error');
//       return;
//     }
    
//     await updateQuantity(itemId, newQuantity);
//   };

//   const handleClearCart = async () => {
//     if (window.confirm('Are you sure you want to clear your cart?')) {
//       await clearCart();
//     }
//   };

//   if (!user || !token) {
//     return (
//       <div className="cart-page">
//         <div className="cart-empty">
//           <FiShoppingCart className="cart-empty-icon" />
//           <h2>Please log in to view your cart</h2>
//           <p>You need to be logged in to access your shopping cart.</p>
//           <button
//             className="login-button"
//             onClick={() => navigate('/login', { state: { from: '/cart' } })}
//           >
//             <FiLogIn className="button-icon" />
//             Log In
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return <div className="cart-page loading">Loading cart...</div>;
//   }

//   return (
//     <div className="cart-page">
//       {notification && (
//         <div className={`notification notification-${notification.type}`}>
//           <FiAlertCircle className="notification-icon" />
//           <span>{notification.message}</span>
//           <button onClick={() => showNotification('', '')}>×</button>
//         </div>
//       )}
      
//       {cart.length === 0 ? (
//         <div className="cart-empty">
//           <FiShoppingCart className="cart-empty-icon" />
//           <h2>Your cart is empty</h2>
//           <p>Start shopping to add items!</p>
//           <button
//             className="shop-now-button"
//             onClick={() => navigate('/products')}
//           >
//             Shop Now
//           </button>
//         </div>
//       ) : (
//         <>
//           <h2 className="cart-title">Your Cart ({cart.length} items)</h2>
//           <div className="cart-list">
//             {cart.map((item) => (
//               <div key={item.itemId} className="cart-item">
//                 <img
//                   src={item.imageUrl ? `${API_BASE}${item.imageUrl}` : PLACEHOLDER_IMAGE}
//                   alt={item.name}
//                   className="cart-item-image"
//                   onError={(e) => {
//                     console.error('Cart image load error:', item.imageUrl);
//                     e.target.src = PLACEHOLDER_IMAGE;
//                   }}
//                 />
//                 <div className="cart-item-details">
//                   <h4>{item.name}</h4>
//                   <p>${item.price.toFixed(2)} each</p>
//                   <div className="cart-quantity">
//                     <button 
//                       onClick={() => handleQuantityChange(item.itemId, -1)}
//                       disabled={item.quantity <= 1 || isLoading}
//                     >
//                       <FiMinus />
//                     </button>
//                     <span>{item.quantity}</span>
//                     <button
//                       onClick={() => handleQuantityChange(item.itemId, 1)}
//                       disabled={(item.product?.stock ?? item.stock ?? 0) <= item.quantity || isLoading}
//                     >
//                       <FiPlus />
//                     </button>
//                   </div>
//                   <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
//                   <div className="cart-item-actions">
//                     <button
//                       onClick={() => handleBuySingleItem(item)}
//                       disabled={isLoading || !item.itemId || !item._id}
//                     >
//                       Buy Now
//                     </button>
//                     <button
//                       onClick={() => removeFromCart(item.itemId)}
//                       disabled={isLoading || !item.itemId}
//                     >
//                       <FiTrash2 /> Remove
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="cart-summary">
//             <h3>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items): 
//               ${calculateTotal().toFixed(2)}</h3>
//             <div className="cart-summary-actions">
//               <button
//                 onClick={handleClearCart}
//                 disabled={isLoading}
//               >
//                 Clear Cart
//               </button>
//               <button
//                 onClick={handleBuyAll}
//                 disabled={isLoading || cart.length === 0}
//                 className="checkout-button"
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;




import React, { useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiAlertCircle, FiLogIn, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
  const {
    cart,
    isLoading,
    removeFromCart,
    updateQuantity,
    clearCart,
    showNotification,
    notification,
    calculateTotal,
  } = useCart();
  
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/80?text=No+Image';

  useEffect(() => {
    console.log('Cart.jsx rendered with cart:', {
      itemCount: cart.length,
      items: cart.map(item => ({
        itemId: item.itemId,
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
      })),
    });
  }, [cart]);

  const handleBuySingleItem = (item) => {
    if (!item.itemId || !item._id) {
      console.error('Invalid item for buy:', item);
      showNotification('Invalid item', 'error');
      return;
    }
    const stock = item.product?.stock ?? item.stock ?? 0;
    if (stock < item.quantity) {
      showNotification(`${item.name} has insufficient stock`, 'error');
      return;
    }
    const buyItem = {
      itemId: item.itemId, // Cart item ID
      _id: item._id, // Product ID
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      stock,
      imageUrl: item.imageUrl || '/Uploads/placeholder.jpg',
    };
    console.log('Buying single item:', buyItem);
    navigate('/buy', { state: { items: [buyItem] } });
  };

  const handleBuyAll = () => {
    if (cart.length === 0) {
      showNotification('Cart is empty', 'error');
      return;
    }
    
    const invalidItems = cart.filter(item => !item.itemId || !item._id);
    if (invalidItems.length > 0) {
      console.error('Invalid items in cart:', invalidItems);
      showNotification('Some cart items are invalid', 'error');
      return;
    }

    const insufficientStockItem = cart.find(item => (item.product?.stock ?? item.stock ?? 0) < item.quantity);
    if (insufficientStockItem) {
      showNotification(`${insufficientStockItem.name} has insufficient stock`, 'error');
      return;
    }
    
    const buyItems = cart.map(item => ({
      itemId: item.itemId, // Cart item ID
      _id: item._id, // Product ID
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      stock: item.product?.stock ?? item.stock ?? 0,
      imageUrl: item.imageUrl || '/Uploads/placeholder.jpg',
    }));
    console.log('Buying all items:', buyItems);
    navigate('/buy', { state: { items: buyItems } });
  };

  const handleQuantityChange = async (itemId, amount) => {
    if (!itemId) {
      console.error('Invalid itemId for quantity change:', itemId);
      showNotification('Invalid item', 'error');
      return;
    }

    const item = cart.find(i => i.itemId === itemId);
    if (!item) {
      console.error('Item not found in cart:', itemId);
      showNotification('Item not found', 'error');
      return;
    }

    const newQuantity = item.quantity + amount;
    if (newQuantity < 1) {
      showNotification('Quantity cannot be less than 1', 'error');
      return;
    }
    
    const stock = item.product?.stock ?? item.stock ?? 0;
    if (stock < newQuantity) {
      showNotification(`Only ${stock} ${item.name} in stock`, 'error');
      return;
    }
    
    await updateQuantity(itemId, newQuantity);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (!user || !token) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <FiShoppingCart className="cart-empty-icon" />
          <h2>Please log in to view your cart</h2>
          <p>You need to be logged in to access your shopping cart.</p>
          <button
            className="login-button"
            onClick={() => navigate('/login', { state: { from: '/cart' } })}
          >
            <FiLogIn className="button-icon" />
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="cart-page loading">Loading cart...</div>;
  }

  return (
    <div className="cart-page">
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <FiAlertCircle className="notification-icon" />
          <span>{notification.message}</span>
          <button onClick={() => showNotification('', '')}>×</button>
        </div>
      )}
      
      {cart.length === 0 ? (
        <div className="cart-empty">
          <FiShoppingCart className="cart-empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items!</p>
          <button
            className="shop-now-button"
            onClick={() => navigate('/products')}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <>
          <h2 className="cart-title">Your Cart ({cart.length} items)</h2>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.itemId} className="cart-item">
                <img
                  src={item.imageUrl ? `${API_BASE}${item.imageUrl}` : PLACEHOLDER_IMAGE}
                  alt={item.name}
                  className="cart-item-image"
                  onError={(e) => {
                    console.error('Cart image load error:', item.imageUrl);
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>{item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} each</p>
                  <div className="cart-quantity">
                    <button 
                      onClick={() => handleQuantityChange(item.itemId, -1)}
                      disabled={item.quantity <= 1 || isLoading}
                    >
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.itemId, 1)}
                      disabled={(item.product?.stock ?? item.stock ?? 0) <= item.quantity || isLoading}
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <p>Total: {(item.price * item.quantity).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                  <div className="cart-item-actions">
                    <button
                      onClick={() => handleBuySingleItem(item)}
                      disabled={isLoading || !item.itemId || !item._id}
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => removeFromCart(item.itemId)}
                      disabled={isLoading || !item.itemId}
                    >
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items): 
              {calculateTotal().toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</h3>
            <div className="cart-summary-actions">
              <button
                onClick={handleClearCart}
                disabled={isLoading}
              >
                Clear Cart
              </button>
              <button
                onClick={handleBuyAll}
                disabled={isLoading || cart.length === 0}
                className="checkout-button"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;