
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import './ProductReview.css';

const ProductReview = () => {
  const { orderId } = useParams(); // Get orderId from URL
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/80?text=No+Image';

  const [order, setOrder] = useState(null);
  const [reviews, setReviews] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification function (placeholder, assumes similar to Buy.jsx)
  const showNotification = (message, type) => {
    console.log(`[${type}] ${message}`); // Replace with actual notification system
  };

  // Normalize image URL to match backend logic
  const normalizeImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '') return PLACEHOLDER_IMAGE;
    if (imageUrl.startsWith('http')) return imageUrl;
    const normalized = imageUrl.replace(/^[Uu]ploads\//, '/Uploads/');
    if (normalized.startsWith('/')) return `${API_BASE}${normalized}`;
    return `${API_BASE}/${normalized}`;
  };

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !token) {
        showNotification('Please log in to submit a review', 'error');
        navigate('/login', { state: { from: `/review/${orderId}` } });
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch order');
        }
        const orderData = await response.json();
        if (orderData.status !== 'Delivered') {
          showNotification('Reviews can only be submitted for delivered orders', 'error');
          navigate('/orders');
          return;
        }
        setOrder({
          ...orderData,
          items: orderData.items.map((item) => ({
            ...item,
            imageUrl: normalizeImageUrl(item.imageUrl),
          })),
        });

        // Initialize review state for each product
        const initialReviews = {};
        orderData.items.forEach((item) => {
          initialReviews[item._id] = { rating: 0, review: '', submitted: false };
        });
        setReviews(initialReviews);
      } catch (err) {
        console.error('Error fetching order:', err.message);
        setError(err.message);
        showNotification(`Failed to load order: ${err.message}`, 'error');
      }
    };

    fetchOrder();
  }, [user, token, orderId, navigate, API_BASE]);

  // Handle rating selection
  const handleRating = (productId, rating) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating },
    }));
  };

  // Handle review text input
  const handleReviewChange = (productId, review) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], review },
    }));
  };

  // Submit review for a product
  const handleSubmitReview = async (productId) => {
    if (isSubmitting) {
      showNotification('Review submission in progress, please wait...', 'info');
      return;
    }

    const { rating, review } = reviews[productId];
    if (!rating) {
      showNotification('Please select a rating', 'error');
      return;
    }
    if (review.length > 500) {
      showNotification('Review must be 500 characters or less', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          productId,
          rating,
          review: review.trim() || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      setReviews((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], submitted: true },
      }));
      showNotification('Review submitted successfully!', 'success');
    } catch (err) {
      console.error('Error submitting review:', err.message);
      showNotification(`Failed to submit review: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !token) return null;
  if (error) return <div className="review-error">Error: {error}</div>;
  if (!order) return <div className="review-loading">Loading order...</div>;

  return (
    <div className="product-review-page">
      <div className="review-header">
        <button
          className="review-back-btn"
          onClick={() => navigate('/orders')}
          aria-label="Back to orders"
        >
          <FaArrowLeft /> Back to Orders
        </button>
        <h1 className="review-title">Review Order #{orderId}</h1>
      </div>

      <div className="review-container">
        {order.items.map((item) => (
          <div key={item._id} className="review-item">
            <div className="review-item-image">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="review-product-image"
                onError={(e) => {
                  console.error('Image load error:', item.imageUrl);
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>
            <div className="review-item-details">
              <h3 className="review-item-name">{item.name}</h3>
              <p className="review-item-price">
                ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
              </p>

              {reviews[item._id]?.submitted ? (
                <div className="review-submitted">
                  <p>Thank you for your review!</p>
                </div>
              ) : (
                <>
                  <div className="review-rating">
                    <label>Rating:</label>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`review-star ${
                            star <= reviews[item._id]?.rating ? 'review-star-filled' : ''
                          }`}
                          onClick={() => handleRating(item._id, star)}
                          aria-label={`Rate ${star} stars`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="review-text">
                    <label htmlFor={`review-${item._id}`}>Review (optional):</label>
                    <textarea
                      id={`review-${item._id}`}
                      placeholder="Share your experience..."
                      value={reviews[item._id]?.review || ''}
                      onChange={(e) => handleReviewChange(item._id, e.target.value)}
                      maxLength={500}
                      rows={4}
                    />
                    <p className="review-char-count">
                      {reviews[item._id]?.review.length || 0}/500 characters
                    </p>
                  </div>
                  <button
                    className="review-submit-btn"
                    onClick={() => handleSubmitReview(item._id)}
                    disabled={isSubmitting || !reviews[item._id]?.rating}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReview;
