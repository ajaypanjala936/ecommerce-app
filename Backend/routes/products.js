



const express = require('express');
const mongoose = require('mongoose');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const router = express.Router();



// Middleware to verify JWT and admin role
const authAdminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    console.log('Fetched products:', products.map(p => ({ name: p.name, imageUrl: p.imageUrl })));
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    console.log('Fetched product:', { name: product.name, imageUrl: product.imageUrl });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: err.message });
  }
});

// Create new product with image
router.post('/', authAdminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, stock, description } = req.body;

    if (!name || !category || !price || !stock || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const imageUrl = req.file ? `/Uploads/${req.file.filename}` : '/Uploads/placeholder.jpg';
    const imagePath = req.file ? path.join(__dirname, '../public/Uploads', req.file.filename) : null;
    
    if (imagePath && !fs.existsSync(imagePath)) {
      console.error(`Image file not found after upload: ${imagePath}`);
      return res.status(500).json({ message: 'Failed to save image' });
    }

    const product = new Product({
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      imageUrl,
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Update product
router.put('/:id', authAdminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete old image if new one is uploaded
    if (req.file && product.imageUrl && product.imageUrl !== '/Uploads/placeholder.jpg') {
      const oldImagePath = path.join(__dirname, '../public', product.imageUrl);
      fs.unlink(oldImagePath, err => {
        if (err) console.error('Error deleting old image:', err);
      });
    }

    const updates = {
      name: req.body.name || product.name,
      category: req.body.category || product.category,
      price: req.body.price ? parseFloat(req.body.price) : product.price,
      stock: req.body.stock ? parseInt(req.body.stock) : product.stock,
      description: req.body.description || product.description,
      imageUrl: req.file ? `/Uploads/${req.file.filename}` : product.imageUrl,
    };

    if (req.file) {
      const newImagePath = path.join(__dirname, '../public/Uploads', req.file.filename);
      if (!fs.existsSync(newImagePath)) {
        console.error(`New image file not found: ${newImagePath}`);
        return res.status(500).json({ message: 'Failed to save new image' });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    console.log(`Updated product: ${updatedProduct.name}, image: ${updatedProduct.imageUrl}`);
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Delete product
router.delete('/:id', authAdminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.error(`Product not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated image
    if (product.imageUrl && product.imageUrl !== '/Uploads/placeholder.jpg') {
      const imagePath = path.join(__dirname, '../public', product.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, err => {
          if (err) console.error('Error deleting image:', err);
        });
      } else {
        console.warn(`Image file not found for deletion: ${imagePath}`);
      }
    }

    await Product.deleteOne({ _id: req.params.id });
    console.log(`Deleted product: ${product.name}, ID: ${req.params.id}`);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;



