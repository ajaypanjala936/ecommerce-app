


// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import { useChat } from '../../context/ChatContext';
// import { FiSearch, FiAlertCircle, FiLoader } from 'react-icons/fi';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import './Home.css';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// const Home = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [allFeaturedProducts, setAllFeaturedProducts] = useState([]);
//   const [visibleProducts, setVisibleProducts] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [newsletterEmail, setNewsletterEmail] = useState('');
//   const [newsletterError, setNewsletterError] = useState('');
//   const [newsletterSuccess, setNewsletterSuccess] = useState('');
//   const { addToCart, showNotification } = useCart();
//   const { user } = useAuth();
//   const { unreadCount } = useChat();
//   const navigate = useNavigate();

//   const categories = [
//     { name: 'Electronics', image: 'https://4bbdwp2p.media.zestyio.com/kitchen-appliances-image.jpg' },
//     { name: 'Fashion', image: 'https://i.ytimg.com/vi/PDJTyqvEUYk/maxresdefault.jpg' },
//     { name: 'Home', image: 'https://wallpapers.com/images/hd/assorted-grocery-items-collection-cm1jp5vlatgnkmkb-cm1jp5vlatgnkmkb.png' },
//     { name: 'Beauty', image: 'https://img.freepik.com/free-photo/close-up-collection-make-up-beauty-products_23-2148620012.jpg?semt=ais_hybrid&w=740' },
//     { name: 'Sports', image: 'https://media.istockphoto.com/id/1136317340/photo/close-up-of-sport-balls-and-equipment.jpg?s=612x612&w=0&k=20&c=JwsgygpYwBWEEUYyWfEYHsYf8bZgZdbFL_wXNpAcXhs=' }
//   ];

//   const carouselSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     pauseOnHover: true,
//     arrows: true
//   };

//   const carouselItems = [
//     {
//       id: 1,
//       title: 'Summer Sale',
//       subtitle: 'Up to 50% off',
//       image: 'https://img.pikbest.com/wp/202405/refrigerator-washing-machine-3d-illustration-of-modern-home-appliances-including-gas-cooker-tv-cinema-microwave-laptop-and_9834862.jpg!sw800',
//       cta: 'Shop Now'
//     },
//     {
//       id: 2,
//       title: 'New Arrivals',
//       subtitle: 'Discover the latest trends',
//       image: 'https://cdn.shopify.com/s/files/1/0817/7988/4088/articles/fashion-ecommerce.jpg?v=1738095976',
//       cta: 'Explore'
//     },
//     {
//       id: 3,
//       title: 'Limited Offer',
//       subtitle: 'Only this weekend',
//       image: 'https://sportsmatik.com/uploads/sports-corner/equipment-bn.jpg',
//       cta: 'Grab Now'
//     },
//     {
//       id: 4,
//       title: 'Exclusive Deals',
//       subtitle: 'Only this weekend',
//       image: 'https://d1n5l80rwxz6pi.cloudfront.net/indian-grocery-items.jpg',
//       cta: 'Grab Now'
//     },
//     {
//       id: 5,
//       title: 'Limited Offer',
//       subtitle: 'Only this weekend',
//       image: 'https://png.pngtree.com/background/20230427/original/pngtree-stack-of-makeup-products-arranged-on-a-black-background-picture-image_2496068.jpg',
//       cta: 'Grab Now'
//     },
//   ];

//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         const response = await fetch(`${API_BASE}/api/products?featured=true`);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch featured products: ${response.statusText}`);
//         }
//         const data = await response.json();
//         setAllFeaturedProducts(data);
//         setVisibleProducts(data.slice(0, 4));
//       } catch (err) {
//         console.error('Fetch products error:', err.message);
//         showNotification('Failed to load featured products', 'error');
//         setAllFeaturedProducts([]);
//         setVisibleProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedProducts();
//   }, [showNotification]);

//   useEffect(() => {
//     if (allFeaturedProducts.length <= 4) return;

//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => {
//         const nextIndex = (prevIndex + 4) % allFeaturedProducts.length;
//         setVisibleProducts(allFeaturedProducts.slice(nextIndex, nextIndex + 4));
//         return nextIndex;
//       });
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [allFeaturedProducts]);

//   const handleAddToCart = async (product) => {
//     if (!product._id) {
//       console.error('Invalid product ID:', product);
//       showNotification('Invalid product', 'error');
//       return;
//     }
//     if (product.stock <= 0) {
//       showNotification(`${product.name} is out of stock`, 'error');
//       return;
//     }
//     console.log('Adding to cart:', { productId: product._id, name: product.name });
//     try {
//       await addToCart(product._id, 1);
//     } catch (err) {
//       console.error('Add to cart failed:', err.message);
//       showNotification(`Failed to add ${product.name} to cart: ${err.message}`, 'error');
//     }
//   };

//   const handleBuyNow = async (product, event) => {
//     event.stopPropagation();
//     if (!product._id) {
//       console.error('Invalid product ID:', product);
//       showNotification('Invalid product', 'error');
//       return;
//     }
//     if (product.stock <= 0) {
//       showNotification(`${product.name} is out of stock`, 'error');
//       return;
//     }
//     console.log('Initiating Buy Now:', { productId: product._id, name: product.name });
//     try {
//       const response = await addToCart(product._id, 1);
//       console.log('Buy Now cart response:', response);
//       const addedItem = response.find(item => item._id === product._id);
//       if (!addedItem || !addedItem.itemId) {
//         throw new Error('Failed to retrieve cart item ID');
//       }
//       showNotification(`${product.name} added to cart. Proceeding to checkout.`, 'success');
//       navigate('/buy', {
//         state: {
//           items: [{
//             itemId: addedItem.itemId,
//             _id: product._id,
//             name: product.name,
//             price: product.price,
//             quantity: 1,
//             stock: product.stock,
//             imageUrl: product.imageUrl || '/Uploads/placeholder.jpg'
//           }]
//         }
//       });
//     } catch (err) {
//       console.error('Buy Now failed:', err.message);
//       showNotification(`Failed to proceed with ${product.name}: ${err.message}`, 'error');
//     }
//   };

//   const handleNewsletterSubmit = async (e) => {
//     e.preventDefault();
//     setNewsletterError('');
//     setNewsletterSuccess('');
//     if (!newsletterEmail.trim()) {
//       setNewsletterError('Please enter a valid email address');
//       return;
//     }
//     try {
//       console.log('Sending newsletter subscription:', { email: newsletterEmail });
//       const response = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: newsletterEmail })
//       });
//       console.log('Newsletter response:', response.status, response.statusText);
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `Failed to subscribe: ${response.statusText}`);
//       }
//       const data = await response.json();
//       console.log('Newsletter success:', data);
//       setNewsletterSuccess('Subscribed successfully! You will receive exclusive offers.');
//       setNewsletterEmail('');
//     } catch (err) {
//       console.error('Newsletter subscription error:', err);
//       setNewsletterError(err.message === 'This email is already subscribed' 
//         ? 'This email is already subscribed. Try a different email or unsubscribe first.'
//         : err.message || 'Subscription failed. Please try again.');
//     }
//   };

//   return (
//     <div className="home">
//       <div className="main-carousel">
//         <Slider {...carouselSettings}>
//           {carouselItems.map((item) => (
//             <div key={item.id} className="carousel-item">
//               <img src={item.image} alt={item.title} onError={(e) => (e.target.src = 'https://via.placeholder.com/1200x500?text=Carousel+Image')} />
//               <div className="carousel-content10">
//                 <h2 className='head10'>{item.title}</h2>
//                 <p>{item.subtitle}</p>
//                 <Link to="/products" className="cta-button10">{item.cta}</Link>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       </div>

//       <section className="categories" aria-labelledby="categories-heading">
//         <h2 id="categories-heading">Shop by Category</h2>
//         <div className="category-grid">
//           {categories.map((category) => (
//             <Link
//               key={category.name}
//               to={`/products?category=${encodeURIComponent(category.name)}`}
//               className="category-card"
//               aria-label={`Shop ${category.name} category`}
//             >
//               <div className="category-image-container">
//                 <img
//                   src={category.image}
//                   alt={category.name}
//                   className="category-image"
//                   onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Category+Image')}
//                 />
//               </div>
//               <h3 className="category-title">{category.name}</h3>
//             </Link>
//           ))}
//         </div>
//       </section>

//       <section className="featured-products13" aria-labelledby="featured-products-heading">
//         <h2 id="featured-products-heading">Featured Products</h2>
//         {loading ? (
//           <div className="loading">
//             <FiLoader className="loading-spinner" /> Loading featured products...
//           </div>
//         ) : visibleProducts.length === 0 ? (
//           <div className="no-products13">No featured products available</div>
//         ) : (
//           <div className="product-grid13">
//             {visibleProducts.map((product) => (
//               <div key={product._id} className="product-card13">
//                 <img
//                   src={product.imageUrl ? `${API_BASE}${product.imageUrl}` : 'https://via.placeholder.com/300?text=No+Image'}
//                   alt={product.name}
//                   onError={(e) => (e.target.src = 'https://via.placeholder.com/300?text=No+Image')}
//                 />
//                 <div className="product-info13">
//                   <h3>{product.name}</h3>
//                   <div className="price">${product.price?.toFixed(2)}</div>
//                   <div className="product-actions13">
//                     <button
//                       className="add-to-cart13"
//                       onClick={() => handleAddToCart(product)}
//                       disabled={product.stock <= 0}
//                       aria-label={`Add ${product.name} to cart`}
//                     >
//                       {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
//                     </button>
//                     <button
//                       className="buy-now13"
//                       onClick={(e) => handleBuyNow(product, e)}
//                       disabled={product.stock <= 0}
//                       aria-label={`Buy ${product.name} now`}
//                     >
//                       {product.stock <= 0 ? 'Out of Stock' : 'Buy Now'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <section className="newsletter" aria-labelledby="newsletter-heading">
//         <h2 id="newsletter-heading">Subscribe to Our Newsletter</h2>
//         <p>Get updates on special offers and new products</p>
//         <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
//           <div className="newsletter-input-group">
//             <input
//               type="email"
//               value={newsletterEmail}
//               onChange={(e) => setNewsletterEmail(e.target.value)}
//               placeholder="Your email address"
//               className="newsletter-input"
//               aria-label="Email address for newsletter"
//             />
//             <button type="submit" className="newsletter-button">Subscribe</button>
//           </div>
//           {newsletterError && (
//             <div className="newsletter-error" role="alert">
//               <FiAlertCircle className="error-icon" /> {newsletterError}
//             </div>
//           )}
//           {newsletterSuccess && (
//             <div className="newsletter-success" role="alert">
//               {newsletterSuccess}
//             </div>
//           )}
//         </form>
//       </section>

//       <footer className="footer">
//         <div className="footer-content">
//           <div className="footer-section">
//             <h3>ShopEase</h3>
//             <p>Your one-stop shop for everything</p>
//           </div>
//           <div className="footer-section">
//             <h4>Quick Links</h4>
//             <ul>
//               <li><Link to="/">Home</Link></li>
//               <li><Link to="/products">Products</Link></li>
//               <li><Link to="/about">About Us</Link></li>
//               <li><Link to="/contact">Contact</Link></li>
//             </ul>
//           </div>
//           <div className="footer-section">
//             <h4>Customer Service</h4>
//             <ul>
//               <li>
//                 <Link to="/faqs" className="footer-link">
//                   FAQs
//                   {unreadCount > 0 && (
//                     <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
//                   )}
//                 </Link>
//               </li>
//               <li><Link to="/shipping">Shipping</Link></li>
//               <li><Link to="/returns">Returns</Link></li>
//               <li><Link to="/privacy">Privacy Policy</Link></li>
//             </ul>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;











import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useChat } from '../../../context/ChatContext';
import { FiSearch, FiAlertCircle, FiLoader } from 'react-icons/fi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allFeaturedProducts, setAllFeaturedProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState('');
  const { addToCart, showNotification } = useCart();
  const { user } = useAuth();
  const { unreadCount } = useChat();
  const navigate = useNavigate();

  const categories = [
    { name: 'Electronics', image: 'https://4bbdwp2p.media.zestyio.com/kitchen-appliances-image.jpg' },
    { name: 'Fashion', image: 'https://i.ytimg.com/vi/PDJTyqvEUYk/maxresdefault.jpg' },
    { name: 'Home', image: 'https://wallpapers.com/images/hd/assorted-grocery-items-collection-cm1jp5vlatgnkmkb-cm1jp5vlatgnkmkb.png' },
    { name: 'Beauty', image: 'https://img.freepik.com/free-photo/close-up-collection-make-up-beauty-products_23-2148620012.jpg?semt=ais_hybrid&w=740' },
    { name: 'Sports', image: 'https://media.istockphoto.com/id/1136317340/photo/close-up-of-sport-balls-and-equipment.jpg?s=612x612&w=0&k=20&c=JwsgygpYwBWEEUYyWfEYHsYf8bZgZdbFL_wXNpAcXhs=' }
  ];

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true
  };

  const carouselItems = [
    {
      id: 1,
      title: 'Summer Sale',
      subtitle: 'Up to 50% off',
      image: 'https://img.pikbest.com/wp/202405/refrigerator-washing-machine-3d-illustration-of-modern-home-appliances-including-gas-cooker-tv-cinema-microwave-laptop-and_9834862.jpg!sw800',
      cta: 'Shop Now'
    },
    {
      id: 2,
      title: 'New Arrivals',
      subtitle: 'Discover the latest trends',
      image: 'https://cdn.shopify.com/s/files/1/0817/7988/4088/articles/fashion-ecommerce.jpg?v=1738095976',
      cta: 'Explore'
    },
    {
      id: 3,
      title: 'Limited Offer',
      subtitle: 'Only this weekend',
      image: 'https://sportsmatik.com/uploads/sports-corner/equipment-bn.jpg',
      cta: 'Grab Now'
    },
    {
      id: 4,
      title: 'Exclusive Deals',
      subtitle: 'Only this weekend',
      image: 'https://d1n5l80rwxz6pi.cloudfront.net/indian-grocery-items.jpg',
      cta: 'Grab Now'
    },
    {
      id: 5,
      title: 'Limited Offer',
      subtitle: 'Only this weekend',
      image: 'https://png.pngtree.com/background/20230427/original/pngtree-stack-of-makeup-products-arranged-on-a-black-background-picture-image_2496068.jpg',
      cta: 'Grab Now'
    },
  ];

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products?featured=true`);
        if (!response.ok) {
          throw new Error(`Failed to fetch featured products: ${response.statusText}`);
        }
        const data = await response.json();
        setAllFeaturedProducts(data);
        setVisibleProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Fetch products error:', err.message);
        showNotification('Failed to load featured products', 'error');
        setAllFeaturedProducts([]);
        setVisibleProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [showNotification]);

  useEffect(() => {
    if (allFeaturedProducts.length <= 4) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 4) % allFeaturedProducts.length;
        setVisibleProducts(allFeaturedProducts.slice(nextIndex, nextIndex + 4));
        return nextIndex;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [allFeaturedProducts]);

  const handleAddToCart = async (product) => {
    if (!product._id) {
      console.error('Invalid product ID:', product);
      showNotification('Invalid product', 'error');
      return;
    }
    if (product.stock <= 0) {
      showNotification(`${product.name} is out of stock`, 'error');
      return;
    }
    console.log('Adding to cart:', { productId: product._id, name: product.name });
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      console.error('Add to cart failed:', err.message);
      showNotification(`Failed to add ${product.name} to cart: ${err.message}`, 'error');
    }
  };

  const handleBuyNow = async (product, event) => {
    event.stopPropagation();
    if (!product._id) {
      console.error('Invalid product ID:', product);
      showNotification('Invalid product', 'error');
      return;
    }
    if (product.stock <= 0) {
      showNotification(`${product.name} is out of stock`, 'error');
      return;
    }
    console.log('Initiating Buy Now:', { productId: product._id, name: product.name });
    try {
      const response = await addToCart(product._id, 1);
      console.log('Buy Now cart response:', response);
      const addedItem = response.find(item => item._id === product._id);
      if (!addedItem || !addedItem.itemId) {
        throw new Error('Failed to retrieve cart item ID');
      }
      showNotification(`${product.name} added to cart. Proceeding to checkout.`, 'success');
      navigate('/buy', {
        state: {
          items: [{
            itemId: addedItem.itemId,
            _id: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            stock: product.stock,
            imageUrl: product.imageUrl || '/Uploads/placeholder.jpg'
          }]
        }
      });
    } catch (err) {
      console.error('Buy Now failed:', err.message);
      showNotification(`Failed to proceed with ${product.name}: ${err.message}`, 'error');
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterError('');
    setNewsletterSuccess('');
    if (!newsletterEmail.trim()) {
      setNewsletterError('Please enter a valid email address');
      return;
    }
    try {
      console.log('Sending newsletter subscription:', { email: newsletterEmail });
      const response = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      console.log('Newsletter response:', response.status, response.statusText);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to subscribe: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Newsletter success:', data);
      setNewsletterSuccess('Subscribed successfully! You will receive exclusive offers.');
      setNewsletterEmail('');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setNewsletterError(err.message === 'This email is already subscribed' 
        ? 'This email is already subscribed. Try a different email or unsubscribe first.'
        : err.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <div className="home">
      <div className="main-carousel">
        <Slider {...carouselSettings}>
          {carouselItems.map((item) => (
            <div key={item.id} className="carousel-item">
              <img src={item.image} alt={item.title} onError={(e) => (e.target.src = 'https://via.placeholder.com/1200x500?text=Carousel+Image')} />
              <div className="carousel-content10">
                <h2 className='head10'>{item.title}</h2>
                <p>{item.subtitle}</p>
                <Link to="/products" className="cta-button10">{item.cta}</Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <section className="categories" aria-labelledby="categories-heading">
        <h2 id="categories-heading">Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="category-card"
              aria-label={`Shop ${category.name} category`}
            >
              <div className="category-image-container">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-image"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Category+Image')}
                />
              </div>
              <h3 className="category-title">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-products13" aria-labelledby="featured-products-heading">
        <h2 id="featured-products-heading">Featured Products</h2>
        {loading ? (
          <div className="loading">
            <FiLoader className="loading-spinner" /> Loading featured products...
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="no-products13">No featured products available</div>
        ) : (
          <div className="product-grid13">
            {visibleProducts.map((product) => (
              <div key={product._id} className="product-card13">
                <img
                  src={product.imageUrl ? `${API_BASE}${product.imageUrl}` : 'https://via.placeholder.com/300?text=No+Image'}
                  alt={product.name}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300?text=No+Image')}
                />
                <div className="product-info13">
                  <h3>{product.name}</h3>
                  <div className="price">{product.price?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
                  <div className="product-actions13">
                    <button
                      className="add-to-cart13"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    <button
                      className="buy-now13"
                      onClick={(e) => handleBuyNow(product, e)}
                      disabled={product.stock <= 0}
                      aria-label={`Buy ${product.name} now`}
                    >
                      {product.stock <= 0 ? 'Out of Stock' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="newsletter" aria-labelledby="newsletter-heading">
        <h2 id="newsletter-heading">Subscribe to Our Newsletter</h2>
        <p>Get updates on special offers and new products</p>
        <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
          <div className="newsletter-input-group">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your email address"
              className="newsletter-input"
              aria-label="Email address for newsletter"
            />
            <button type="submit" className="newsletter-button">Subscribe</button>
          </div>
          {newsletterError && (
            <div className="newsletter-error" role="alert">
              <FiAlertCircle className="error-icon" /> {newsletterError}
            </div>
          )}
          {newsletterSuccess && (
            <div className="newsletter-success" role="alert">
              {newsletterSuccess}
            </div>
          )}
        </form>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ShopEase</h3>
            <p>Your one-stop shop for everything</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li>
                <Link to="/faqs" className="footer-link">
                  FAQs
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </Link>
              </li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;