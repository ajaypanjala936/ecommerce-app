

const express = require('express');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');

const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    console.error('No token provided in request');
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded; // { id, email, name, role }
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// GET /api/notifications - Fetch user's notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching notifications for:', { email: req.user.email, userId: req.user.id });
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    console.log('Fetched notifications:', notifications.length, 'for user:', req.user.email);
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    if (String(notification.userId) !== req.user.id) {
      console.warn('Unauthorized delete attempt:', {
        notificationId: req.params.id,
        userId: req.user.id,
        notificationUserId: notification.userId,
      });
      return res.status(403).json({ error: 'Unauthorized to delete this notification' });
    }

    await Notification.deleteOne({ _id: req.params.id });
    console.log(`Notification ${req.params.id} deleted by user: ${req.user.email}`);
    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Error deleting notification:', err.message);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// GET /api/notifications - Fetch user's notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching notifications for user:', req.user.email);
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    console.log('Fetched notifications:', notifications.length);
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET /api/notifications/unread - Fetch count of unread notifications
router.get('/unread', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching unread notification count for user:', req.user.email);
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });
    console.log('Unread notification count:', unreadCount);
    res.json({ count: unreadCount });
  } catch (err) {
    console.error('Error fetching unread notification count:', err.message);
    res.status(500).json({ error: 'Failed to fetch unread notification count' });
  }
});

// POST /api/notifications/mark-read - Mark notifications as read
router.post('/mark-read', authMiddleware, async (req, res) => {
  try {
    console.log('Marking notifications as read for user:', req.user.id);
    const result = await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    console.log('Notifications marked as read:', result.modifiedCount);
    res.json({ message: 'Notifications marked as read', modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('Error marking notifications as read:', err.message);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    await Notification.deleteOne({ _id: req.params.id });
    console.log('Notification deleted:', req.params.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Error deleting notification:', err.message);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});


module.exports = router;