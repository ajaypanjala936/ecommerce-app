// const express = require('express');
// const router = express.Router();
// const Newsletter = require('../models/Newsletter');
// const validator = require('validator');
// const nodemailer = require('nodemailer');
//  const crypto = require('crypto');
//  const auth = require('../middleware/authMiddleware');

// router.post('/subscribe', async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Validate input
//     if (!email || !email.trim()) {
//       return res.status(400).json({ error: 'Please enter a valid email address' });
//     }
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ error: 'Invalid email address' });
//     }

//     // Check if email is already subscribed
//     const existingSubscription = await Newsletter.findOne({ email: email.toLowerCase() });
//     if (existingSubscription) {
//       return res.status(409).json({ error: 'This email is already subscribed' });
//     }

//     // Create and save new subscription
//     const subscription = new Newsletter({ email: email.toLowerCase() });
//     await subscription.save();

//     console.log(`New newsletter subscription: ${email}`);
//     res.status(201).json({ message: 'Subscribed successfully' });
//   } catch (err) {
//     console.error('Error subscribing to newsletter:', err);
//     res.status(500).json({ error: 'Subscription failed. Please try again.' });
//   }
// });

// module.exports = router;







const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const validator = require('validator');
const nodemailer = require('nodemailer');
const auth = require('../middleware/authMiddleware');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

// POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    const existingSubscription = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existingSubscription) {
      // Option 1: Return 409 (current behavior)
      return res.status(409).json({ error: 'This email is already subscribed' });

      // Option 2: Allow resubscription (uncomment to enable)
      /*
      existingSubscription.createdAt = new Date();
      await existingSubscription.save();
      console.log(`Refreshed subscription: ${email}`);
      return res.status(200).json({ message: 'Subscribed successfully' });
      */
    }
    const subscription = new Newsletter({
      email: email.toLowerCase(),
    });
    await subscription.save();
    console.log(`New newsletter subscription: ${email}`);
    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Error subscribing to newsletter:', err);
    res.status(500).json({ error: 'Subscription failed. Please try again.' });
  }
});

// POST /api/newsletter/send (admin-only)
router.post('/send', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    const { subject, html } = req.body;
    if (!subject || !html) {
      return res.status(400).json({ error: 'Subject and HTML content are required' });
    }
    const subscribers = await Newsletter.find({});
    if (subscribers.length === 0) {
      return res.status(400).json({ error: 'No subscribers found' });
    }
    const sendPromises = subscribers.map((subscriber) =>
      transporter.sendMail({
        from: `"ShopEase" <${process.env.EMAIL_USER}>`,
        to: subscriber.email,
        subject,
        html: html.replace('{{email}}', subscriber.email).replace('{{unsubscribe}}', 
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`),
      })
    );
    await Promise.all(sendPromises);
    console.log(`Newsletter sent to ${subscribers.length} subscribers`);
    res.status(200).json({ message: `Newsletter sent to ${subscribers.length} subscribers` });
  } catch (err) {
    console.error('Error sending newsletter:', err);
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
});

// POST /api/newsletter/unsubscribe
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    const subscription = await Newsletter.findOneAndDelete({ email: email.toLowerCase() });
    if (!subscription) {
      return res.status(404).json({ error: 'Email not found in subscription list' });
    }
    console.log(`Unsubscribed: ${email}`);
    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error('Error unsubscribing:', err);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// GET /api/newsletter/subscribers (admin-only)
router.get('/subscribers', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    const subscribers = await Newsletter.find({}).select('email createdAt');
    console.log(`Fetched ${subscribers.length} subscribers`);
    res.status(200).json(subscribers);
  } catch (err) {
    console.error('Error fetching subscribers:', err);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

module.exports = router;