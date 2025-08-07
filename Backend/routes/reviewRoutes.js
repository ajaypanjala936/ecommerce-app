
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// Get reviews for a product
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Submit a review for a product
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, review, userName } = req.body;
    const productId = req.params.id;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (!review || review.trim().length === 0) {
      return res.status(400).json({ error: 'Review text is required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Use userName from request body, authenticated user, or default to 'Anonymous'
    const finalUserName = userName || req.user.name || 'Anonymous';

    // Create and save review
    const newReview = new Review({
      productId,
      rating,
      review,
      userName: finalUserName,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;