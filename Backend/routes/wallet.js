const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const { authMiddleware } = require('./authRoutes'); // Fixed import

// Get wallet balance and transactions
router.get('/wallet', authMiddleware, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id }).lean();
    if (!wallet) {
      const newWallet = new Wallet({ userId: req.user.id, balance: 0, transactions: [] });
      await newWallet.save();
      return res.status(200).json({ balance: newWallet.balance, transactions: newWallet.transactions });
    }
    res.status(200).json({ balance: wallet.balance, transactions: wallet.transactions });
  } catch (err) {
    console.error('Wallet fetch error:', err);
    res.status(500).json({ error: 'Server error fetching wallet' });
  }
});

// Add funds to wallet
router.post('/wallet/credit', authMiddleware, async (req, res) => {
  const { amount, description } = req.body;
  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      wallet = new Wallet({ userId: req.user.id, balance: 0, transactions: [] });
    }
    wallet.balance += amount;
    wallet.transactions.push({
      type: 'credit',
      amount,
      description,
    });
    await wallet.save();
    res.status(200).json({ balance: wallet.balance, transactions: wallet.transactions });
  } catch (err) {
    console.error('Wallet credit error:', err);
    res.status(500).json({ error: 'Server error adding funds' });
  }
});

// Deduct funds from wallet
router.post('/wallet/debit', authMiddleware, async (req, res) => {
  const { amount, description } = req.body;
  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet not found' });
    }
    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    wallet.balance -= amount;
    wallet.transactions.push({
      type: 'debit',
      amount,
      description,
    });
    await wallet.save();
    res.status(200).json({ balance: wallet.balance, transactions: wallet.transactions });
  } catch (err) {
    console.error('Wallet debit error:', err);
    res.status(500).json({ error: 'Server error deducting funds' });
  }
});

module.exports = router;