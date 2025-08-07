

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Submit feedback
router.post('/submit', async (req, res) => {
  try {
    const { name, email, message, userId } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const contact = new Contact({
      name,
      email,
      message,
      userId,
    });
    await contact.save();

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get all feedbacks
router.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Contact.find().sort({ createdAt: -1 }); // Sort by newest
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Delete feedback by ID
router.delete('/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Contact.findByIdAndDelete(id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

module.exports = router;