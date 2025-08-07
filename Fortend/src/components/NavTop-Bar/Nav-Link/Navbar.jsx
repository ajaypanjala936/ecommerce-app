

// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';
// import { FiSearch, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
// import "./Navbar.css";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const { user, logout } = useAuth();
//   const { cart, notification } = useCart();
//   const navigate = useNavigate();
//   const profileRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setIsProfileOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//     setIsProfileOpen(false);
//   };

//   const toggleProfile = () => {
//     setIsProfileOpen(!isProfileOpen);
//     setIsMenuOpen(false);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//       setIsMenuOpen(false);
//     }
//   };

//   const handleAdminClick = () => {
//     setIsMenuOpen(false);
//     if (user?.role === 'admin') {
//       navigate('/dashboard');
//     } else {
//       navigate('/admin/login');
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     setIsProfileOpen(false);
//     setIsMenuOpen(false);
//     navigate('/');
//   };

//   return (
//     <nav className="navbar">
//     {notification && (
//         <div className={`notification ${notification.type}`}>
//           {notification.message}
//         </div>
//       )}
      
//       <div className="navbar-container">
//         <Link to="/" className="navbar-logo">
//           <span className="logo-first">Express.</span>
//           <span className="logo-second">Com</span>
//           <span className="logo-third">📦</span>
//         </Link>
        
//         <form className="navbar-search1" onSubmit={handleSearch}>
//           <input
//             className="input-search1"
//             type="search"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             aria-label="Search products"
//           /> 
//           <button type="submit" className="search-button1" aria-label="Search">
//             <FiSearch />
//           </button>
//         </form>
        
//         <div 
//           className={`navbar-mobile-menu ${isMenuOpen ? 'active' : ''}`}
//           onClick={toggleMenu}
//           aria-label="Toggle menu"
//         >
//           <span></span>
//           <span></span>
//           <span></span>
//         </div>
        
//         <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
//           <li>
//             <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
//           </li>
//           <li>
//             <Link to="/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
//           </li>
          
//           <li>
//             <Link to="/cart" className="navbar-link cart-link" onClick={() => setIsMenuOpen(false)}>
//               <FiShoppingCart className="cart-icon" />
//               {cart.length > 0 && (
//                 <span className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
//               )}
//             </Link>
//           </li>
          
//           <li>
//             <button
//               className="navbar-link navbar-button"
//               onClick={handleAdminClick}
//               aria-label="Admin dashboard"
//             >
//               <span className="admin-icon">👑</span> Admin
//             </button>
//           </li>
          
//           <li className="profile-container" ref={profileRef}>
//             {user ? (
//               <>
//                 <button onClick={toggleProfile} className="navbar-button profile-button" aria-label="Toggle profile">
//                   <FiUser /> {user.name}
//                 </button>
//                 {isProfileOpen && (
//                   <div className="profile-dropdown">
//                     <Link to="/user-details" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                     <span className="profile-icon">👤</span> User Details
//                     </Link>
//                     <Link to="/wallet" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">💰</span> Wallet
//                     </Link>
//                     <Link to="/orders" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">📦</span> My Orders
//                     </Link>
//                     <Link to="/notifications" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">🔔</span> Notifications
//                     </Link>
//                     <button onClick={handleLogout} className="profile-link profile-logout">
//                       <FiLogOut className="profile-icon" /> Logout
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
//                 <FiUser /> Login
//               </Link>
//             )}
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;






// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';
// import { FiSearch, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
// import "./Navbar.css";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const { user, logout } = useAuth();
//   const { cart, notification } = useCart();
//   const navigate = useNavigate();
//   const profileRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setIsProfileOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//     setIsProfileOpen(false);
//   };

//   const toggleProfile = () => {
//     setIsProfileOpen(!isProfileOpen);
//     setIsMenuOpen(false);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//       setIsMenuOpen(false);
//     }
//   };


//   const handleLogout = () => {
//     logout();
//     setIsProfileOpen(false);
//     setIsMenuOpen(false);
//     navigate('/');
//   };

//   // Defensive check for cart
//   const cartCount = Array.isArray(cart) && cart.length > 0
//     ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
//     : 0;

//   return (
//     <nav className="navbar">
//       {notification && (
//         <div className={`notification ${notification.type}`}>
//           {notification.message}
//         </div>
//       )}
      
//       <div className="navbar-container">
//         <Link to="/" className="navbar-logo">
//           <span className="logo-first">Express.</span>
//           <span className="logo-second">Com</span>
//           <span className="logo-third">📦</span>
//         </Link>
        
//         <form className="navbar-search1" onSubmit={handleSearch}>
//           <input
//             className="input-search1"
//             type="search"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             aria-label="Search products"
//           /> 
//           <button type="submit" className="search-button1" aria-label="Search">
//             <FiSearch />
//           </button>
//         </form>
        
//         <div 
//           className={`navbar-mobile-menu ${isMenuOpen ? 'active' : ''}`}
//           onClick={toggleMenu}
//           aria-label="Toggle menu"
//         >
//           <span></span>
//           <span></span>
//           <span></span>
//         </div>
        
//         <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
//           <li>
//             <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
//           </li>
//           <li>
//             <Link to="/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
//           </li>
          
//           <li>
//             <Link to="/cart" className="navbar-link cart-link" onClick={() => setIsMenuOpen(false)}>
//               <FiShoppingCart className="cart-icon" />
//               {cartCount > 0 && (
//                 <span className="cart-count">{cartCount}</span>
//               )}
//             </Link>
//           </li>
        
          
//           <li className="profile-container" ref={profileRef}>
//             {user ? (
//               <>
//                 <button onClick={toggleProfile} className="navbar-button profile-button" aria-label="Toggle profile">
//                   <FiUser /> {user.name}
//                 </button>
//                 {isProfileOpen && (
//                   <div className="profile-dropdown">
//                     <Link to="/user-details" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">👤</span> User Details
//                     </Link>
//                     <Link to="/wallet" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">💰</span> Wallet
//                     </Link>
//                     <Link to="/orders" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">📦</span> My Orders
//                     </Link>
//                     <Link to="/notifications" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">🔔</span> Notifications
//                     </Link>
//                     <button onClick={handleLogout} className="profile-link profile-logout">
//                       <FiLogOut className="profile-icon" /> Logout
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
//                 <FiUser /> Login
//               </Link>
//             )}
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;










// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';
// import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
// import "./Navbar.css";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const { user, logout } = useAuth();
//   const { cart, notification } = useCart();
//   const navigate = useNavigate();
//   const profileRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setIsProfileOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//     setIsProfileOpen(false);
//   };

//   const toggleProfile = () => {
//     setIsProfileOpen(!isProfileOpen);
//     setIsMenuOpen(false);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//       setIsMenuOpen(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     setIsProfileOpen(false);
//     setIsMenuOpen(false);
//     navigate('/');
//   };

//   // Defensive check for cart
//   const cartCount = Array.isArray(cart) && cart.length > 0
//     ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
//     : 0;

//   return (
//     <nav className="navbar">
//       {notification && (
//         <div className={`notification ${notification.type}`}>
//           {notification.message}
//         </div>
//       )}
      
//       <div className="navbar-container">
//         <Link to="/" className="navbar-logo">
//           <span className="logo-first">Express.</span>
//           <span className="logo-second">Com</span>
//           <span className="logo-third">📦</span>
//         </Link>
        
//         <form className="navbar-search1" onSubmit={handleSearch}>
//           <input
//             className="input-search1"
//             type="search"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             aria-label="Search products"
//           /> 
//           <button type="submit" className="search-button1" aria-label="Search">
//             <FiSearch />
//           </button>
//         </form>
        
//         <div 
//           className={`navbar-mobile-menu ${isMenuOpen ? 'active' : ''}`}
//           onClick={toggleMenu}
//           aria-label="Toggle menu"
//         >
//           <span></span>
//           <span></span>
//           <span></span>
//         </div>
        
//         <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
//           <li>
//             <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
//           </li>
//           <li>
//             <Link to="/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
//           </li>
          
//           <li>
//             <Link to="/cart" className="navbar-link cart-link" onClick={() => setIsMenuOpen(false)}>
//               <FiShoppingCart className="cart-icon" />
//               {cartCount > 0 && (
//                 <span className="cart-count">{cartCount}</span>
//               )}
//             </Link>
//           </li>
        
//           <li className="profile-container" ref={profileRef}>
//             {user ? (
//               <>
//                 <button 
//                   onClick={toggleProfile} 
//                   className="navbar-button profile-button" 
//                   aria-label="Toggle profile"
//                 >
//                   <FiUser /> {user.name} <FiChevronDown className="dropdown-arrow" />
//                 </button>
//                 {isProfileOpen && (
//                   <div className="profile-dropdown">
//                     <Link to="/user-details" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">👤</span> User Details
//                     </Link>
//                     <Link to="/wallet" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">💰</span> Wallet
//                     </Link>
//                     <Link to="/orders" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">📦</span> My Orders
//                     </Link>
//                     <Link to="/notifications" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">🔔</span> Notifications
//                     </Link>
//                     <button onClick={handleLogout} className="profile-link profile-logout">
//                       <FiLogOut className="profile-icon" /> Logout
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
//                 <FiUser /> Login
//               </Link>
//             )}
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;









// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';
// import { useNotification } from '../context/NotificationContext';
// import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
// import "./Navbar.css";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const { user, logout } = useAuth();
//   const { cart, notification } = useCart();
//   const { unreadNotificationCount } = useNotification();
//   const navigate = useNavigate();
//   const profileRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setIsProfileOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//     setIsProfileOpen(false);
//   };

//   const toggleProfile = () => {
//     setIsProfileOpen(!isProfileOpen);
//     setIsMenuOpen(false);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//       setIsMenuOpen(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     setIsProfileOpen(false);
//     setIsMenuOpen(false);
//     navigate('/');
//   };

//   // Defensive check for cart
//   const cartCount = Array.isArray(cart) && cart.length > 0
//     ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
//     : 0;

//   return (
//     <nav className="navbar">
//       {notification && (
//         <div className={`notification ${notification.type}`}>
//           {notification.message}
//         </div>
//       )}
      
//       <div className="navbar-container">
//         <Link to="/" className="navbar-logo">
//           <span className="logo-first">Express.</span>
//           <span className="logo-second">Com</span>
//           <span className="logo-third">📦</span>
//         </Link>
        
//         <form className="navbar-search1" onSubmit={handleSearch}>
//           <input
//             className="input-search1"
//             type="search"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             aria-label="Search products"
//           /> 
//           <button type="submit" className="search-button1" aria-label="Search">
//             <FiSearch />
//           </button>
//         </form>
        
//         <div 
//           className={`navbar-mobile-menu ${isMenuOpen ? 'active' : ''}`}
//           onClick={toggleMenu}
//           aria-label="Toggle menu"
//         >
//           <span></span>
//           <span></span>
//           <span></span>
//         </div>
        
//         <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
//           <li>
//             <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
//           </li>
//           <li>
//             <Link to="/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
//           </li>
          
//           <li>
//             <Link to="/cart" className="navbar-link cart-link" onClick={() => setIsMenuOpen(false)}>
//               <FiShoppingCart className="cart-icon" />
//               {cartCount > 0 && (
//                 <span className="cart-count">{cartCount}</span>
//               )}
//             </Link>
//           </li>
        
//           <li className="profile-container" ref={profileRef}>
//             {user ? (
//               <>
//                 <button 
//                   onClick={toggleProfile} 
//                   className="navbar-button profile-button" 
//                   aria-label="Toggle profile"
//                 >
//                   <FiUser /> {user.name} <FiChevronDown className="dropdown-arrow" />
//                 </button>
//                 {isProfileOpen && (
//                   <div className="profile-dropdown">
//                     <Link to="/user-details" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">👤</span> User Details
//                     </Link>
//                     <Link to="/wallet" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">💰</span> Wallet
//                     </Link>
//                     <Link to="/orders" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">📦</span> My Orders
//                     </Link>
//                     <Link to="/notifications" className="profile-link" onClick={() => setIsProfileOpen(false)}>
//                       <span className="profile-icon">🔔</span> Notifications
//                       {unreadNotificationCount > 0 && (
//                         <span className="notification-count">{unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}</span>
//                       )}
//                     </Link>
//                     <button onClick={handleLogout} className="profile-link profile-logout">
//                       <FiLogOut className="profile-icon" /> Logout
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
//                 <FiUser /> Login
//               </Link>
//             )}
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
















import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useNotification } from '../../../context/NotificationContext';
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { cart, notification } = useCart();
  const { unreadNotificationCount } = useNotification();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  // Defensive check for cart
  const cartCount = Array.isArray(cart) && cart.length > 0
    ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
    : 0;

  return (
    <nav className="navbar">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-first">Express.</span>
          <span className="logo-second">Com</span>
          <span className="logo-third">📦</span>
        </Link>
        
        <form className="navbar-search1" onSubmit={handleSearch}>
          <input
            className="input-search1"
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          /> 
          <button type="submit" className="search-button1" aria-label="Search">
            <FiSearch />
          </button>
        </form>
        
        <div 
          className={`navbar-mobile-menu ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
          </li>
          
          <li>
            <Link to="/cart" className="navbar-link cart-link" onClick={() => setIsMenuOpen(false)}>
              <FiShoppingCart className="cart-icon" />
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Link>
          </li>
        
          <li className="profile-container" ref={profileRef}>
            {user ? (
              <>
                <button 
                  onClick={toggleProfile} 
                  className="navbar-button profile-button" 
                  aria-label="Toggle profile"
                >
                  <FiUser /> {user.name} <FiChevronDown className="dropdown-arrow" />
                </button>
                {isProfileOpen && (
                  <div className="profile-dropdown">
                    {user.role === 'admin' && (
                      <Link to="/dashboard" className="profile-link" onClick={() => setIsProfileOpen(false)}>
                        <span className="profile-icon">📊</span> Dashboard
                      </Link>
                    )}
                    <Link to="/user-details" className="profile-link" onClick={() => setIsProfileOpen(false)}>
                      <span className="profile-icon">👤</span> User Details
                    </Link>
                    <Link to="/wallet" className="profile-link" onClick={() => setIsProfileOpen(false)}>
                      <span className="profile-icon">💰</span> Wallet
                    </Link>
                    <Link to="/orders" className="profile-link" onClick={() => setIsProfileOpen(false)}>
                      <span className="profile-icon">📦</span> My Orders
                    </Link>
                    <Link to="/notifications" className="profile-link" onClick={() => setIsProfileOpen(false)}>
                      <span className="profile-icon">🔔</span> Notifications
                      {unreadNotificationCount > 0 && (
                        <span className="notification-count">{unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}</span>
                      )}
                    </Link>
                    <button onClick={handleLogout} className="profile-link profile-logout">
                      <FiLogOut className="profile-icon" /> Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <FiUser /> Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;