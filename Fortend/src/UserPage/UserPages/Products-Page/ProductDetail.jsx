






import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { AuthContext } from '../../../context/AuthContext';
import { FiSearch, FiLoader, FiAlertCircle, FiHome, FiStar, FiShare2 } from 'react-icons/fi';
import './ProductDetail.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300?text=No+Image';

const ProductDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const { addToCart, showNotification } = useCart();
  const { user, token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const categories = [...new Set(products.map((p) => p.category?.toLowerCase() || 'uncategorized'))];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        if (id) {
          // Fetch single product
          const productResponse = await fetch(`${API_BASE}/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!productResponse.ok) {
            const errorText = await productResponse.text();
            try {
              const errorData = JSON.parse(errorText);
              throw new Error(errorData.error || `Failed to fetch product: ${productResponse.status}`);
            } catch {
              throw new Error(`Invalid response: ${errorText.slice(0, 100)}`);
            }
          }
          const productData = await productResponse.json();
          console.log('Fetched product:', productData);
          setSingleProduct(productData);

          // Fetch reviews
          const reviewsResponse = await fetch(`${API_BASE}/api/products/${id}/reviews`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);
          } else {
            console.warn('No reviews found for product:', id);
          }

          // Fetch related products (same category)
          const allProductsResponse = await fetch(`${API_BASE}/api/products`);
          if (allProductsResponse.ok) {
            const allProducts = await allProductsResponse.json();
            const related = allProducts
              .filter(
                (p) =>
                  p.category?.toLowerCase() === productData.category?.toLowerCase() &&
                  p._id !== productData._id
              )
              .slice(0, 4);
            setRelatedProducts(related);
          }
        } else {
          // Fetch all products for list view
          const response = await fetch(`${API_BASE}/api/products`);
          if (!response.ok) {
            const errorText = await response.text();
            try {
              const errorData = JSON.parse(errorText);
              throw new Error(errorData.error || `Failed to fetch products: ${response.status}`);
            } catch {
              throw new Error(`Invalid response: ${errorText.slice(0, 100)}`);
            }
          }
          const data = await response.json();
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(err.message);
        if (!id) {
          setProducts([]);
          setFilteredProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  useEffect(() => {
    if (id) return;

    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get('q')?.toLowerCase() || '';
    const categoryParam = queryParams.get('category')?.toLowerCase() || '';

    setSearchQuery(searchParam);

    let filtered = products;
    if (searchParam) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchParam) ||
          product.description?.toLowerCase().includes(searchParam) ||
          product.category?.toLowerCase().includes(searchParam)
      );
    } else if (categoryParam) {
      filtered = filtered.filter(
        (product) => product.category?.toLowerCase() === categoryParam
      );
    }
    setFilteredProducts(filtered);
  }, [location.search, products, id]);

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMAGE;
    e.target.onerror = null;
  };

  const handleAddToCart = (product) => {
    if (!product._id) {
      console.error('Invalid product ID:', product);
      showNotification('Invalid product', 'error');
      return;
    }
    if (product.stock < quantity) {
      showNotification(`Only ${product.stock} ${product.name} in stock`, 'error');
      return;
    }
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl || '/Uploads/placeholder.jpg',
      product: { stock: product.stock }, // Include stock for validation
    };
    console.log('Adding to cart:', cartItem);
    addToCart(cartItem, quantity);
    setQuantity(1);
  };

  const handleBuyNow = (product) => {
    if (!product._id) {
      console.error('Invalid product ID:', product);
      showNotification('Invalid product', 'error');
      return;
    }
    if (product.stock < quantity) {
      showNotification(`Only ${product.stock} ${product.name} in stock`, 'error');
      return;
    }
    const buyItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl || '/Uploads/placeholder.jpg',
      product: { stock: product.stock },
    };
    console.log('Buying now:', buyItem);
    navigate('/buy', { state: { items: [buyItem] } });
  };

  const handleCategoryFilter = (category) => {
    if (category === 'all') {
      navigate('/products');
    } else {
      navigate(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= singleProduct?.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleRating = (rating) => {
    setUserRating(rating);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification('Please log in to submit a review', 'error');
      navigate('/login');
      return;
    }
    if (!userRating || !reviewText.trim()) {
      showNotification('Please provide a rating and review', 'error');
      return;
    }
    if (!user.name) {
      showNotification('User profile incomplete. Please update your profile.', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: userRating, review: reviewText, userName: user.name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setUserRating(0);
      setReviewText('');
      showNotification('Review submitted successfully', 'success');
    } catch (err) {
      console.error('Review submission error:', err.message);
      showNotification(`Error submitting review: ${err.message}`, 'error');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showNotification('Product URL copied to clipboard!', 'success');
    }).catch(() => {
      showNotification('Failed to copy URL', 'error');
    });
  };

  const calculateAverageRating = () => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const maxReviews = Math.max(...Object.values(ratingDistribution), 1);

  const dismissError = () => {
    setError('');
  };

  return (
    <div className="product-detail__container">
      <main className="product-detail__main">
        {loading && (
          <div className="product-detail__loading">
            <FiLoader className="product-detail__loading-spinner" />
            <p>Loading {id ? 'product' : 'products'}...</p>
          </div>
        )}

        {error && (
          <div className="product-detail__error">
            <h2>Error</h2>
            <div className="product-detail__error-message" role="alert">
              <FiAlertCircle className="product-detail__error-icon" />
              <span>{error}</span>
              <button className="product-detail__error-dismiss" onClick={dismissError} aria-label="Dismiss error">
                ×
              </button>
            </div>
            <button className="product-detail__retry-button" onClick={() => window.location.reload()}>
              Try Again
            </button>
            {id && (
              <Link to="/products" className="product-detail__btn-secondary">
                Back to Products
              </Link>
            )}
          </div>
        )}

        {id && !singleProduct && !loading && !error && (
          <div className="product-detail__error">
            <h2>Product Not Found</h2>
            <p>No product exists with ID: {id}</p>
            <Link to="/products" className="product-detail__btn-secondary">
              Back to Products
            </Link>
          </div>
        )}

        {id && singleProduct && !loading && !error && (
          <div className="product-detail__single">
            <nav className="product-detail__breadcrumbs">
              <Link to="/" className="product-detail__breadcrumb-link">
                <FiHome /> Home
              </Link>
              <span className="product-detail__breadcrumb-separator">/</span>
              <Link to="/products" className="product-detail__breadcrumb-link">Products</Link>
              <span className="product-detail__breadcrumb-separator">/</span>
              <span className="product-detail__breadcrumb-current">{singleProduct.name}</span>
            </nav>
            <h1 className="product-detail__title">{singleProduct.name}</h1>
            <div className="product-detail__card product-detail__card--single">
              <div className="product-detail__image-container">
                <img
                  src={singleProduct.imageUrl ? `${API_BASE}${singleProduct.imageUrl}` : PLACEHOLDER_IMAGE}
                  alt={singleProduct.name}
                  className="product-detail__image10"
                  onError={handleImageError}
                />
                {singleProduct.stock <= 0 && <div className="product-detail__out-of-stock">Out of Stock</div>}
              </div>
              <div className="product-detail__info10">
                <p><strong>ID:</strong> {singleProduct._id}</p>
                <p className="product-detail__price">{singleProduct.price?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                <div className="product-detail__rating">
                  <span>Average Rating: {calculateAverageRating()} </span>
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < Math.round(calculateAverageRating()) ? 'product-detail__star product-detail__star--filled' : 'product-detail__star'}
                    />
                  ))}
                  <span> ({reviews.length} reviews)</span>
                </div>
                <p className="product-detail__description">{singleProduct.description || 'No description available'}</p>
                <div className="product-detail__meta">
                  <span className="product-detail__category">{singleProduct.category || 'Uncategorized'}</span>
                  <span className={`product-detail__stock ${singleProduct.stock <= 5 ? 'product-detail__stock--low' : ''}`}>
                    {singleProduct.stock} in stock
                  </span>
                </div>
                <div className="product-detail__quantity">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= singleProduct.stock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div className="product-detail__actions">
                  <button
                    className="product-detail__add-to-cart"
                    onClick={() => handleAddToCart(singleProduct)}
                    disabled={singleProduct.stock <= 0}
                    aria-label={`Add ${singleProduct.name} to cart`}
                  >
                    {singleProduct.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    className="product-detail__buy-now"
                    onClick={() => handleBuyNow(singleProduct)}
                    disabled={singleProduct.stock <= 0}
                    aria-label={`Buy ${singleProduct.name} now`}
                  >
                    Buy Now
                  </button>
                  <button
                    className="product-detail__share"
                    onClick={handleShare}
                    aria-label="Share product"
                  >
                    <FiShare2 />
                  </button>
                </div>
              </div>
            </div>
            <div className="product-detail__reviews">
              <h2 className='product-detail__reviews_heading'>Customer Reviews</h2>
              <div className="product-detail__rating-overview">
                <div className="product-detail__overall-rating">
                  <span className="product-detail__average-rating">{calculateAverageRating()}</span>
                  <div className="product-detail__rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={i < Math.round(calculateAverageRating()) ? 'product-detail__star product-detail__star--filled' : 'product-detail__star'}
                      />
                    ))}
                  </div>
                  <span className="product-detail__review-count">Based on {reviews.length} reviews</span>
                </div>
                <div className="product-detail__rating-distribution">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="product-detail__distribution-item">
                      <span className="product-detail__star-label">{star} <span className='product-detail__star-gold'>★</span></span>
                      <div className="product-detail__rating-bar">
                        <div
                          className={`product-detail__bar-fill product-detail__bar-fill--${star}`}
                          style={{ width: `${(ratingDistribution[star] / maxReviews) * 100}%` }}
                        ></div>
                      </div>
                      <span className="product-detail__review-count">{ratingDistribution[star]} <span>👤</span></span>
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleReviewSubmit} className="product-detail__review-form">
                <div className="product-detail__rating-selector">
                  <label>Rate this product:</label>
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < userRating ? 'product-detail__star product-detail__star--filled' : 'product-detail__star'}
                      onClick={() => handleRating(i + 1)}
                    />
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review here..."
                  required
                />
                <button type="submit" disabled={!user}>Submit Review</button>
              </form>
              <div className="product-detail__reviews-list">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="product-detail__review">
                      <div className="product-detail__review-header">
                        <span className="product-detail__review-user">{review.userName || 'Anonymous'}</span>
                        <div className="product-detail__review-rating">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={i < review.rating ? 'product-detail__star product-detail__star--filled' : 'product-detail__star'}
                            />
                          ))}
                        </div>
                      </div>
                      <p>{review.review}</p>
                      <p className="product-detail__review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
            {relatedProducts.length > 0 && (
              <div className="product-detail__related">
                <h2 className='product-detail__related-heading'>Related Products</h2>
                <div className="product-detail__grid">
                  {relatedProducts.map((product) => (
                    <div key={product._id} className="product-detail__card">
                      <Link to={`/products/${product._id}`} className="product-detail__link">
                        <div className="product-detail__image-container">
                          <img
                            src={product.imageUrl ? `${API_BASE}${product.imageUrl}` : PLACEHOLDER_IMAGE}
                            alt={product.name}
                            className="product-detail__image"
                            onError={handleImageError}
                          />
                          {product.stock <= 0 && (
                            <div className="product-detail__out-of-stock">Out of Stock</div>
                          )}
                        </div>
                        <div className="product-detail__info">
                          <h3 className="product-detail__name">{product.name}</h3>
                          <p className="product-detail__price">{product.price?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                          <p className="product-detail__description">
                            {product.description?.substring(0, 100) || 'No description available'}
                            {product.description?.length > 100 ? '...' : ''}
                          </p>
                          <div className="product-detail__meta">
                            <span className="product-detail__category">{product.category || 'Uncategorized'}</span>
                            <span className={`product-detail__stock ${product.stock <= 5 ? 'product-detail__stock--low' : ''}`}>
                              {product.stock} in stock
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Link to="/products" className="product-detail__btn-secondary">
              Back to Products
            </Link>
          </div>
        )}

        {!id && !loading && !error && (
          <div className="product-detail__list">
            <div className="product-detail__list-header">
              <h1 className="product-detail__title">
                {(() => {
                  const queryParams = new URLSearchParams(location.search);
                  const searchQuery = queryParams.get('q');
                  const categoryQuery = queryParams.get('category');
                  if (searchQuery) {
                    return `Search Results for "${searchQuery}"`;
                  } else if (categoryQuery) {
                    return `${categoryQuery.charAt(0).toUpperCase() + categoryQuery.slice(1)} Products`;
                  }
                  return 'Our Products';
                })()}
              </h1>
              <div className="product-detail__category-filters">
                <button
                  className={`product-detail__category-button ${!location.search.includes('category') ? 'product-detail__category-button--active' : ''}`}
                  onClick={() => handleCategoryFilter('all')}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`product-detail__category-button ${location.search.includes(`category=${category}`) ? 'product-detail__category-button--active' : ''}`}
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="product-detail__no-products">
                <h2>No products found</h2>
                <p>
                  {new URLSearchParams(location.search).get('q')
                    ? 'Try a different search term.'
                    : new URLSearchParams(location.search).get('category')
                    ? `No products available in this category.`
                    : 'Add some products to get started!'}
                </p>
                <Link to="/admin/products" className="product-detail__add-product-button">
                  Add Your First Product
                </Link>
              </div>
            ) : (
              <div className="product-detail__grid">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="product-detail__card">
                    {loading ? (
                      <div className="product-detail__skeleton">
                        <div className="product-detail__skeleton-image"></div>
                        <div className="product-detail__skeleton-text"></div>
                        <div className="product-detail__skeleton-text"></div>
                      </div>
                    ) : (
                      <Link to={`/products/${product._id}`} className="product-detail__link">
                        <div className="product-detail__image-container">
                          <img
                            src={product.imageUrl ? `${API_BASE}${product.imageUrl}` : PLACEHOLDER_IMAGE}
                            alt={product.name}
                            className="product-detail__image"
                            onError={handleImageError}
                          />
                          {product.stock <= 0 && (
                            <div className="product-detail__out-of-stock">Out of Stock</div>
                          )}
                        </div>
                        <div className="product-detail__info">
                          <h3 className="product-detail__name">{product.name}</h3>
                          <p className="product-detail__price">{product.price?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                          <p className="product-detail__description">
                            {product.description?.substring(0, 100) || 'No description available'}
                            {product.description?.length > 100 ? '...' : ''}
                          </p>
                          <div className="product-detail__meta">
                            <span className="product-detail__category">{product.category || 'Uncategorized'}</span>
                            <span className={`product-detail__stock ${product.stock <= 5 ? 'product-detail__stock--low' : ''}`}>
                              {product.stock} in stock
                            </span>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;