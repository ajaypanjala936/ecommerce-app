


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authMiddleware } = require('./authRoutes'); // Updated to authRoutes.js
const Product = require('../models/Product'); // Import Product model

const Cart = require('../models/Cart')

// Get cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    const items = cart.items.map(item => ({
      itemId: item._id,
      _id: item.product?._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl || item.product?.imageUrl || '/Uploads/placeholder.jpg',
      stock: item.product?.stock ?? 0,
    }));
    console.log('Cart fetched for user:', req.user.email, items);
    res.status(200).json({ items });
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add to cart
router.post('/add', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid product ID or quantity' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        name: product.name,
        imageUrl: product.imageUrl,
      });
    }
    await cart.save();
    const updatedCart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    const items = updatedCart.items.map(item => ({
      itemId: item._id,
      _id: item.product?._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl || item.product?.imageUrl || '/Uploads/placeholder.jpg',
      stock: item.product?.stock ?? 0,
    }));
    console.log('Added to cart:', items);
    res.status(200).json({ items });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Remove from cart
router.delete('/remove/:itemId', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    const updatedCart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    const items = updatedCart ? updatedCart.items.map(item => ({
      itemId: item._id,
      _id: item.product?._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl || item.product?.imageUrl || '/Uploads/placeholder.jpg',
      stock: item.product?.stock ?? 0,
    })) : [];
    console.log('Removed from cart:', items);
    res.status(200).json({ items });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

// Clear cart
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    console.log('Cart cleared for user:', req.user.email);
    res.status(200).json({ items: [] });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;




