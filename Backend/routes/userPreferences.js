const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyUnsubscribeToken } = require('../utils/auth');
const { logger } = require('../utils/logger');

// Handle unsubscribe requests
router.get('/unsubscribe', async (req, res) => {
  try {
    const { token, email } = req.query;
    
    if (!token || !email) {
      return res.status(400).send('Invalid unsubscribe link');
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    // Verify token
    if (!verifyUnsubscribeToken(token, user._id)) {
      return res.status(401).send('Invalid or expired unsubscribe link');
    }
    
    // Update user preferences
    user.emailPreferences = user.emailPreferences || {};
    user.emailPreferences.cartReminders = false;
    await user.save();
    
    logger.info(`User ${email} unsubscribed from cart reminders`);
    
    // Render success page or redirect
    res.send(`
      <html>
        <head><title>Unsubscribed</title></head>
        <body>
          <h1>You have been unsubscribed</h1>
          <p>You will no longer receive cart reminder emails.</p>
          <p><a href="${process.env.FRONTEND_BASE || 'http://localhost:3000'}">Return to site</a></p>
        </body>
      </html>
    `);
  } catch (error) {
    logger.error('Unsubscribe error:', error);
    res.status(500).send('An error occurred while processing your request');
  }
});

module.exports = router;