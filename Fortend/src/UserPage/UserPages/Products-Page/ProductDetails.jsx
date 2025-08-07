

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import './ProductDetails.css';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
// const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300?text=No+Image';

// const ProductDetails = () => {
//   const { id } = useParams();
//   const { user, token, logout } = useAuth();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [newReview, setNewReview] = useState({ rating: 5, review: '' });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reviewError, setReviewError] = useState(null);

//   useEffect(() => {
//     if (!user || !token || user.role !== 'admin') {
//       console.log('Redirecting: Not admin or not authenticated', { userRole: user?.role, hasToken: !!token });
//       setError('Access denied. Admin login required.');
//       setLoading(false);
//       navigate('/admin/login');
//       return;
//     }

//     const fetchProduct = async () => {
//       try {
//         console.log(`Fetching product ID: ${id}`);
//         const response = await fetch(`${API_BASE}/api/products/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const responseText = await response.text();
//         if (!response.ok) {
//           try {
//             const errorData = JSON.parse(responseText);
//             if (response.status === 401) {
//               throw new Error('Unauthorized: Please log in again');
//             }
//             if (response.status === 404) {
//               throw new Error('Product not found');
//             }
//             throw new Error(errorData.error || `Failed to fetch product (Status: ${response.status})`);
//           } catch (e) {
//             console.error('Non-JSON response from /api/products/:id:', responseText);
//             throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
//           }
//         }
//         const data = JSON.parse(responseText);
//         console.log('Fetched product:', data);
//         setProduct(data);
//       } catch (err) {
//         console.error('Fetch product error:', err.message);
//         setError(err.message);
//         if (err.message.includes('Unauthorized')) {
//           logout();
//           navigate('/admin/login');
//         }
//       }
//     };

//     const fetchReviews = async () => {
//       try {
//         console.log(`Fetching reviews for product ID: ${id}`);
//         const response = await fetch(`${API_BASE}/api/products/${id}/reviews`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const responseText = await response.text();
//         if (!response.ok) {
//           try {
//             const errorData = JSON.parse(responseText);
//             throw new Error(errorData.error || `Failed to fetch reviews (Status: ${response.status})`);
//           } catch (e) {
//             console.error('Non-JSON response from /api/products/:id/reviews:', responseText);
//             throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
//           }
//         }
//         const data = JSON.parse(responseText);
//         console.log('Fetched reviews:', data);
//         setReviews(data);
//       } catch (err) {
//         console.error('Fetch reviews error:', err.message);
//         setReviewError(err.message);
//       }
//     };

//     const loadData = async () => {
//       setLoading(true);
//       await Promise.all([fetchProduct(), fetchReviews()]);
//       setLoading(false);
//     };

//     loadData();
//   }, [id, user, token, logout, navigate]);

//   const handleImageError = (e) => {
//     e.target.src = PLACEHOLDER_IMAGE;
//     e.target.onerror = null;
//   };

//   const handleReviewChange = (e) => {
//     const { name, value } = e.target;
//     setNewReview((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!user || !token) {
//       setReviewError('You must be logged in to submit a review');
//       return;
//     }
//     try {
//       const { rating, review } = newReview;
//       if (!rating || rating < 1 || rating > 5) {
//         throw new Error('Rating must be between 1 and 5');
//       }
//       if (!review || review.trim().length === 0) {
//         throw new Error('Review text is required');
//       }

//       console.log('Submitting review:', { rating, review, userName: user.name || 'Anonymous' });
//       const response = await fetch(`${API_BASE}/api/products/${id}/reviews`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ rating: parseInt(rating), review, userName: user.name || 'Anonymous' }),
//       });
//       const responseText = await response.text();
//       if (!response.ok) {
//         try {
//           const errorData = JSON.parse(responseText);
//           throw new Error(errorData.error || `Failed to submit review (Status: ${response.status})`);
//         } catch (e) {
//           console.error('Non-JSON response from /api/products/:id/reviews POST:', responseText);
//           throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
//         }
//       }
//       const addedReview = JSON.parse(responseText);
//       console.log('Submitted review:', addedReview);
//       setReviews([addedReview, ...reviews]);
//       setNewReview({ rating: 5, review: '' });
//       setReviewError(null);
//     } catch (err) {
//       console.error('Submit review error:', err.message);
//       setReviewError(err.message);
//     }
//   };

//   const averageRating = reviews.length > 0
//     ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
//     : 0;

//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <span
//           key={i}
//           className={i <= rating ? 'product-details-star filled' : 'product-details-star'}
//           aria-label={`${i} star${i === 1 ? '' : 's'}`}
//         >
//           ★
//         </span>
//       );
//     }
//     return stars;
//   };

//   if (loading) {
//     return (
//       <div className="product-details-loading">
//         <div className="product-details-spinner"></div>
//         <p>Loading product details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="product-details-error">
//         <h2>Error</h2>
//         <p>{error}</p>
//         <button className="product-details-retry-btn" onClick={() => window.location.reload()}>
//           Try Again
//         </button>
//         <Link to="/admin/products" className="product-details-back-btn">
//           Back to Products
//         </Link>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="product-details-not-found">
//         <h2>Product Not Found</h2>
//         <p>No product exists with ID: {id}</p>
//         <Link to="/admin/products" className="product-details-back-btn">
//           Back to Products
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="product-details">
//       <h2 className="product-details-title">Product Details</h2>
//       <div className="product-details-card">
//         {product.imageUrl ? (
//           <img
//             src={`${API_BASE}${product.imageUrl}`}
//             alt={product.name}
//             className="product-details-image"
//             onError={handleImageError}
//           />
//         ) : (
//           <img
//             src={PLACEHOLDER_IMAGE}
//             alt="No image available"
//             className="product-details-image"
//           />
//         )}
//         <div className="product-details-info">
//           <h3 className="product-details-name">{product.name}</h3>
//           <p className="product-details-field"><strong>ID:</strong> {product._id}</p>
//           <p className="product-details-field"><strong>Category:</strong> {product.category}</p>
//           <p className="product-details-field"><strong>Price:</strong> ${product.price.toFixed(2)}</p>
//           <p className="product-details-field"><strong>Stock:</strong> {product.stock}</p>
//           <p className="product-details-description"><strong>Description:</strong> {product.description || 'No description available'}</p>
//           <div className="product-details-rating">
//             <strong>Average Rating:</strong>
//             <span className="product-details-stars" aria-label={`Average rating: ${averageRating.toFixed(1)} out of 5 stars`}>
//               {renderStars(Math.round(averageRating))}
//             </span>
//             <span>({reviews.length} reviews)</span>
//           </div>
//         </div>
//       </div>
//       <div className="product-details-reviews">
//         <h3>Reviews</h3>
//         {reviews.length === 0 ? (
//           <p className="product-details-no-reviews">No reviews yet.</p>
//         ) : (
//           <ul className="product-details-review-list">
//             {reviews.map((review) => (
//               <li key={review._id} className="product-details-review">
//                 <div className="product-details-review-header">
//                   <span className="product-details-review-user">{review.userName}</span>
//                   <span className="product-details-review-date">
//                     {new Date(review.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="product-details-review-rating" aria-label={`Rating: ${review.rating} out of 5 stars`}>
//                   {renderStars(review.rating)}
//                 </div>
//                 <p className="product-details-review-text">{review.review}</p>
//               </li>
//             ))}
//           </ul>
//         )}
//         <div className="product-details-review-form">
//           <h4>Submit a Review</h4>
//           {reviewError && <p className="product-details-form-error">{reviewError}</p>}
//           <form onSubmit={handleReviewSubmit}>
//             <div className="product-details-form-group">
//               <label htmlFor="rating">Rating</label>
//               <select
//                 id="rating"
//                 name="rating"
//                 value={newReview.rating}
//                 onChange={handleReviewChange}
//                 required
//                 aria-required="true"
//                 aria-label="Select rating"
//               >
//                 {[1, 2, 3, 4, 5].map((value) => (
//                   <option key={value} value={value}>
//                     {value} Star{value === 1 ? '' : 's'}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="product-details-form-group">
//               <label htmlFor="review">Review</label>
//               <textarea
//                 id="review"
//                 name="review"
//                 value={newReview.review}
//                 onChange={handleReviewChange}
//                 required
//                 aria-required="true"
//                 aria-label="Enter your review"
//                 placeholder="Write your review here..."
//               />
//             </div>
//             <button type="submit" className="ap-btn ap-btn-primary">
//               Submit Review
//             </button>
//           </form>
//         </div>
//       </div>
//       <div className="product-details-actions">
//         <Link to="/admin/products" className="product-details-back-btn">
//           Back to Products
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;









import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './ProductDetails.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300?text=No+Image';

const ProductDetails = () => {
  const { id } = useParams();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, review: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    if (!user || !token || user.role !== 'admin') {
      console.log('Redirecting: Not admin or not authenticated', { userRole: user?.role, hasToken: !!token });
      setError('Access denied. Admin login required.');
      setLoading(false);
      navigate('/admin/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        console.log(`Fetching product ID: ${id}`);
        const response = await fetch(`${API_BASE}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const responseText = await response.text();
        if (!response.ok) {
          try {
            const errorData = JSON.parse(responseText);
            if (response.status === 401) {
              throw new Error('Unauthorized: Please log in again');
            }
            if (response.status === 404) {
              throw new Error('Product not found');
            }
            throw new Error(errorData.error || `Failed to fetch product (Status: ${response.status})`);
          } catch (e) {
            console.error('Non-JSON response from /api/products/:id:', responseText);
            throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
          }
        }
        const data = JSON.parse(responseText);
        console.log('Fetched product:', data);
        setProduct(data);
      } catch (err) {
        console.error('Fetch product error:', err.message);
        setError(err.message);
        if (err.message.includes('Unauthorized')) {
          logout();
          navigate('/admin/login');
        }
      }
    };

    const fetchReviews = async () => {
      try {
        console.log(`Fetching reviews for product ID: ${id}`);
        const response = await fetch(`${API_BASE}/api/products/${id}/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const responseText = await response.text();
        if (!response.ok) {
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.error || `Failed to fetch reviews (Status: ${response.status})`);
          } catch (e) {
            console.error('Non-JSON response from /api/products/:id/reviews:', responseText);
            throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
          }
        }
        const data = JSON.parse(responseText);
        console.log('Fetched reviews:', data);
        setReviews(data);
      } catch (err) {
        console.error('Fetch reviews error:', err.message);
        setReviewError(err.message);
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProduct(), fetchReviews()]);
      setLoading(false);
    };

    loadData();
  }, [id, user, token, logout, navigate]);

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMAGE;
    e.target.onerror = null;
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      setReviewError('You must be logged in to submit a review');
      return;
    }
    try {
      const { rating, review } = newReview;
      if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
      if (!review || review.trim().length === 0) {
        throw new Error('Review text is required');
      }

      console.log('Submitting review:', { rating, review, userName: user.name || 'Anonymous' });
      const response = await fetch(`${API_BASE}/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: parseInt(rating), review, userName: user.name || 'Anonymous' }),
      });
      const responseText = await response.text();
      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || `Failed to submit review (Status: ${response.status})`);
        } catch (e) {
          console.error('Non-JSON response from /api/products/:id/reviews POST:', responseText);
          throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
        }
      }
      const addedReview = JSON.parse(responseText);
      console.log('Submitted review:', addedReview);
      setReviews([addedReview, ...reviews]);
      setNewReview({ rating: 5, review: '' });
      setReviewError(null);
    } catch (err) {
      console.error('Submit review error:', err.message);
      setReviewError(err.message);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? 'product-details-star filled' : 'product-details-star'}
          aria-label={`${i} star${i === 1 ? '' : 's'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="product-details-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button className="product-details-retry-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
        <Link to="/admin/products" className="product-details-back-btn">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-not-found">
        <h2>Product Not Found</h2>
        <p>No product exists with ID: {id}</p>
        <Link to="/admin/products" className="product-details-back-btn">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details">
      <h2 className="product-details-title">Product Details</h2>
      <div className="product-details-card">
        {product.imageUrl ? (
          <img
            src={`${API_BASE}${product.imageUrl}`}
            alt={product.name}
            className="product-details-image"
            onError={handleImageError}
          />
        ) : (
          <img
            src={PLACEHOLDER_IMAGE}
            alt="No image available"
            className="product-details-image"
          />
        )}
        <div className="product-details-info">
          <h3 className="product-details-name">{product.name}</h3>
          <p className="product-details-field"><strong>ID:</strong> {product._id}</p>
          <p className="product-details-field"><strong>Category:</strong> {product.category}</p>
          <p className="product-details-field"><strong>Price:</strong> {product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
          <p className="product-details-field"><strong>Stock:</strong> {product.stock}</p>
          <p className="product-details-description"><strong>Description:</strong> {product.description || 'No description available'}</p>
          <div className="product-details-rating">
            <strong>Average Rating:</strong>
            <span className="product-details-stars" aria-label={`Average rating: ${averageRating.toFixed(1)} out of 5 stars`}>
              {renderStars(Math.round(averageRating))}
            </span>
            <span>({reviews.length} reviews)</span>
          </div>
        </div>
      </div>
      <div className="product-details-reviews">
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p className="product-details-no-reviews">No reviews yet.</p>
        ) : (
          <ul className="product-details-review-list">
            {reviews.map((review) => (
              <li key={review._id} className="product-details-review">
                <div className="product-details-review-header">
                  <span className="product-details-review-user">{review.userName}</span>
                  <span className="product-details-review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="product-details-review-rating" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                  {renderStars(review.rating)}
                </div>
                <p className="product-details-review-text">{review.review}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="product-details-review-form">
          <h4>Submit a Review</h4>
          {reviewError && <p className="product-details-form-error">{reviewError}</p>}
          <form onSubmit={handleReviewSubmit}>
            <div className="product-details-form-group">
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                name="rating"
                value={newReview.rating}
                onChange={handleReviewChange}
                required
                aria-required="true"
                aria-label="Select rating"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} Star{value === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </div>
            <div className="product-details-form-group">
              <label htmlFor="review">Review</label>
              <textarea
                id="review"
                name="review"
                value={newReview.review}
                onChange={handleReviewChange}
                required
                aria-required="true"
                aria-label="Enter your review"
                placeholder="Write your review here..."
              />
            </div>
            <button type="submit" className="ap-btn ap-btn-primary">
              Submit Review
            </button>
          </form>
        </div>
      </div>
      <div className="product-details-actions">
        <Link to="/admin/products" className="product-details-back-btn">
          Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;