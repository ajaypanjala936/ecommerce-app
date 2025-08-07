






// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { useAuth } from './AuthContext';
// import axios from 'axios';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const { user, token } = useAuth();
//   const [cart, setCart] = useState([]); // Initialize as empty array
//   const [notification, setNotification] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Fetch cart from API
//   const fetchCart = async () => {
//     if (!user || !token) {
//       console.log('No user or token, clearing cart');
//       setCart([]); // Ensure cart is always an array
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE}/api/cart`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const items = Array.isArray(response.data.items) ? response.data.items : [];
//       console.log('Fetched cart:', { itemCount: items.length, items });
//       setCart(items);
//     } catch (error) {
//       console.error('Error fetching cart:', {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data,
//       });
//       setNotification({
//         message: error.response?.data?.message || 'Failed to load cart',
//         type: 'error',
//       });
//       setCart([]); // Ensure cart is always an array on error
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Load cart when user or token changes
//   useEffect(() => {
//     console.log('CartContext useEffect triggered:', { user: !!user, token: !!token });
//     fetchCart();
//   }, [user, token]);

//   // Add item to cart
//   const addToCart = async (item) => {
//     if (!user || !token) {
//       setNotification({
//         message: 'Please login to add items to cart',
//         type: 'error',
//       });
//       return;
//     }

//     if (!item._id || typeof item._id !== 'string') {
//       console.error('Invalid product ID:', item._id);
//       setNotification({
//         message: 'Invalid product ID',
//         type: 'error',
//       });
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await axios.post(
//         `${API_BASE}/api/cart/add`,
//         { productId: item._id, quantity: item.quantity || 1 },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const items = Array.isArray(response.data.cart.items) ? response.data.cart.items : [];
//       console.log('Added to cart:', { itemCount: items.length, items });
//       setCart(items);
//       setNotification({
//         message: `Added ${item.name} to cart`,
//         type: 'success',
//       });
//     } catch (error) {
//       console.error('Error adding to cart:', {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data,
//       });
//       setNotification({
//         message: error.response?.data?.message || 'Failed to add to cart',
//         type: 'error',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Remove item from cart
//   const removeFromCart = async (itemId) => {
//     if (!itemId || itemId === 'undefined') {
//       console.error('Invalid itemId for removal:', itemId);
//       setNotification({
//         message: 'Invalid item ID',
//         type: 'error',
//       });
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await axios.delete(
//         `${API_BASE}/api/cart/remove/${itemId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const items = Array.isArray(response.data.cart.items) ? response.data.cart.items : [];
//       console.log('Removed from cart:', { itemCount: items.length, items });
//       setCart(items);
//       setNotification({
//         message: 'Item removed from cart',
//         type: 'success',
//       });
//     } catch (error) {
//       console.error('Error removing from cart:', {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data,
//       });
//       setNotification({
//         message: error.response?.data?.message || 'Failed to remove item',
//         type: 'error',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Update item quantity
//   const updateQuantity = async (itemId, quantity) => {
//     if (!itemId || itemId === 'undefined') {
//       console.error('Invalid itemId for update:', itemId);
//       setNotification({
//         message: 'Invalid item ID',
//         type: 'error',
//       });
//       return;
//     }

//     if (!quantity || quantity < 1) {
//       console.error('Invalid quantity:', quantity);
//       setNotification({
//         message: 'Valid quantity is required',
//         type: 'error',
//       });
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await axios.put(
//         `${API_BASE}/api/cart/update/${itemId}`,
//         { quantity },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const items = Array.isArray(response.data.cart.items) ? response.data.cart.items : [];
//       console.log('Updated quantity:', { itemId, quantity, itemCount: items.length, items });
//       setCart(items);
//       setNotification({
//         message: 'Quantity updated successfully',
//         type: 'success',
//       });
//     } catch (error) {
//       console.error('Error updating cart:', {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data,
//       });
//       setNotification({
//         message: error.response?.data?.message || 'Failed to update quantity',
//         type: 'error',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Clear cart
//   const clearCart = async () => {
//     try {
//       setIsLoading(true);
//       await axios.delete(`${API_BASE}/api/cart/clear`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log('Cart cleared');
//       setCart([]);
//       setNotification({
//         message: 'Cart cleared successfully',
//         type: 'success',
//       });
//     } catch (error) {
//       console.error('Error clearing cart:', {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data,
//       });
//       setNotification({
//         message: error.response?.data?.message || 'Failed to clear cart',
//         type: 'error',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Show notification with auto-clear
//   const showNotification = (message, type) => {
//     if (!message) {
//       setNotification(null);
//       return;
//     }
//     console.log('Showing notification:', { message, type });
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   // Calculate total
//   const calculateTotal = () => {
//     return Array.isArray(cart)
//       ? cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0)
//       : 0;
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         isLoading,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         showNotification,
//         notification,
//         calculateTotal,
//         fetchCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;

// };








// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';

// const CartContext = createContext();
// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// const CartProvider = ({ children }) => {
//   const { user, token } = useAuth();
//   const [cart, setCart] = useState([]);
//   const [notification, setNotification] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Fetch cart on mount or user change
//   useEffect(() => {
//     const fetchCart = async () => {
//       if (user && token) {
//         setIsLoading(true);
//         try {
//           const response = await axios.get(`${API_BASE}/api/cart`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setCart(response.data.items || []);
//           console.log('Cart fetched:', response.data.items);
//         } catch (err) {
//           console.error('Error fetching cart:', err.message);
//           showNotification('Failed to load cart', 'error');
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };
//     fetchCart();
//   }, [user, token]);

//   const showNotification = (message, type) => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 5000);
//   };

//   const calculateTotal = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const addToCart = async (productId, quantity) => {
//     if (!user || !token) {
//       showNotification('Please log in to add items to cart', 'error');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `${API_BASE}/api/cart/add`,
//         { productId, quantity },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCart(response.data.items || []);
//       showNotification('Item added to cart', 'success');
//       console.log('Added to cart:', response.data.items);
//     } catch (err) {
//       console.error('Error adding to cart:', err.message);
//       showNotification('Failed to add item to cart', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const removeFromCart = async (itemId) => {
//     if (!user || !token) {
//       showNotification('Please log in to remove items from cart', 'error');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await axios.delete(`${API_BASE}/api/cart/remove/${itemId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCart(response.data.items || []);
//       showNotification('Item removed from cart', 'success');
//       console.log('Removed from cart:', response.data.items);
//     } catch (err) {
//       console.error('Error removing from cart:', err.message);
//       showNotification('Failed to remove item from cart', 'error');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateQuantity = async (itemId, quantity) => {
//     if (!user || !token) {
//       showNotification('Please log in to update cart', 'error');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await axios.put(
//         `${API_BASE}/api/cart/update`,
//         { itemId, quantity },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCart(response.data.items || []);
//       showNotification('Quantity updated', 'success');
//       console.log('Updated cart:', response.data.items);
//     } catch (err) {
//       console.error('Error updating quantity:', err.message);
//       showNotification('Failed to update quantity', 'error');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const clearCart = async () => {
//     if (!user || !token) {
//       showNotification('Please log in to clear cart', 'error');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       await axios.delete(`${API_BASE}/api/cart/clear`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCart([]);
//       showNotification('Cart cleared', 'success');
//       console.log('Cart cleared');
//     } catch (err) {
//       console.error('Error clearing cart:', err.message);
//       showNotification('Failed to clear cart', 'error');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const value = {
//     cart,
//     isLoading,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     showNotification,
//     notification,
//     calculateTotal,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export { CartProvider, useCart };





import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart on mount or user change
  useEffect(() => {
    const fetchCart = async () => {
      if (user && token) {
        setIsLoading(true);
        try {
          const response = await axios.get(`${API_BASE}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCart(response.data.items || []);
          console.log('Cart fetched:', response.data.items);
        } catch (err) {
          console.error('Error fetching cart:', err.response?.data?.error || err.message);
          showNotification('Failed to load cart', 'error');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchCart();
  }, [user, token]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const addToCart = async (productId, quantity) => {
    if (!user || !token) {
      throw new Error('Please log in to add items to cart');
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/api/cart/add`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.items || []);
      showNotification('Item added to cart', 'success');
      console.log('Added to cart:', response.data.items);
      return response.data.items; // Return items for Buy Now
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('Error adding to cart:', errorMsg);
      showNotification(`Failed to add item to cart: ${errorMsg}`, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user || !token) {
      showNotification('Please log in to remove items from cart', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.delete(`${API_BASE}/api/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.items || []);
      showNotification('Item removed from cart', 'success');
      console.log('Removed from cart:', response.data.items);
    } catch (err) {
      console.error('Error removing from cart:', err.response?.data?.error || err.message);
      showNotification('Failed to remove item from cart', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user || !token) {
      showNotification('Please log in to update cart', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE}/api/cart/update`,
        { itemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.items || []);
      showNotification('Quantity updated', 'success');
      console.log('Updated cart:', response.data.items);
    } catch (err) {
      console.error('Error updating quantity:', err.response?.data?.error || err.message);
      showNotification('Failed to update quantity', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user || !token) {
      showNotification('Please log in to clear cart', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
      showNotification('Cart cleared', 'success');
      console.log('Cart cleared');
    } catch (err) {
      console.error('Error clearing cart:', err.response?.data?.error || err.message);
      showNotification('Failed to clear cart', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    showNotification,
    notification,
    calculateTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartProvider, useCart };