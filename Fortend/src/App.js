



import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './UserPage/UserLogin/Login';
import Register from './UserPage/UserLogin/Register';
import AdminLogin from './AdminPage/AdminLogin/AdminLogin';
import AdminRegister from './AdminPage/AdminLogin/AdminRegister';
import { CartProvider } from './context/CartContext';
import { ChatProvider } from './context/ChatContext';
import { NotificationProvider } from './context/NotificationContext';
import Forgot from './UserPage/UserLogin/Forgot';
import ResetPassword from './UserPage/UserLogin/ResetPassword';
import Navbar from './components/NavTop-Bar/Nav-Link/Navbar';
import Layout from './components/NavTop-Bar/Nav-Link/Layout';
import Home from './UserPage/UserPages/Home-Page/Home';

import Buy from './UserPage/UserPages/Products-Page/Buy';

import FAQs from './UserPage/UserPages/Home-Page/FAQs';
import ProductDetail from './UserPage/UserPages/Products-Page/ProductDetail';
import ProductDetails from './UserPage/UserPages/Products-Page/ProductDetails';
import Cart from './UserPage/UserPages/Products-Page/Cart';
import PrivacyPolicy from './UserPage/UserPages/Home-Page/PrivacyPolicy';
import Returns from './UserPage/UserPages/Home-Page/Returns';
import Shipping from './UserPage/UserPages/Home-Page/Shipping';
import AdminProducts from './AdminPage/AdminDashboard/Products/AdminProducts';
import MyOrders from './components/NavTop-Bar/Profile-Link/MyOrders';
import ScrollToTop from './components/NavTop-Bar/Nav-Link/ScrollToTop';
import OrderConfirmation from './UserPage/UserPages/Products-Page/OrderConfirmation';
import UserDetails from './components/NavTop-Bar/Profile-Link/UserDetails';
import Wallet from './components/NavTop-Bar/Profile-Link/Wallet';
import Dashboard from './AdminPage/AdminDashboard/Dashboard/Dashboard';
import About from './UserPage/UserPages/Home-Page/About';
import Contact from './UserPage/UserPages/Home-Page/Contact';
import Notification from './components/NavTop-Bar/Profile-Link/Notification';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
        <ChatProvider>
        <NotificationProvider>
          < ScrollToTop />
          <Navbar />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user-details" element={< UserDetails />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/products" element={<ProductDetail />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/:id" element={<ProductDetails />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
            </Route>
          </Routes>
          </NotificationProvider>
          </ChatProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;









// import React from 'react'
// import Practice from './practice/Practice'

// const App = () => {
//   return (
//     <div>
//       <Practice/>
//     </div>
//   )
// }

// export default App