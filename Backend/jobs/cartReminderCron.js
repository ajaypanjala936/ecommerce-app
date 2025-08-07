






const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Cart = require('../models/Cart');

const API_BASE = process.env.API_BASE || 'http://localhost:5000';

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('Cart reminder email transporter verification failed:', error);
  } else {
    console.log('Cart reminder email transporter is ready');
  }
});

// Email template for cart reminder
const getCartReminderTemplate = (name, email, items) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; background: #f9f9f9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: #007bff; color: #fff; padding: 15px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
    .header h1 { margin: 0; font-size: 20px; }
    .content { padding: 20px; }
    .content p { font-size: 14px; line-height: 1.5; margin: 10px 0; }
    .cart-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .cart-table th, .cart-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    .cart-table th { background: #f4f4f4; font-size: 14px; }
    .cart-table td { font-size: 13px; }
    .cart-table img { max-width: 60px; height: auto; border-radius: 4px; }
    .cta { display: inline-block; padding: 10px 20px; background: #007bff; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; }
    .footer { text-align: center; padding: 15px; font-size: 12px; color: #666; }
    .footer a { color: #007bff; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Cart is Waiting, ${name}!</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>You left some great items in your ShopEase cart. Complete your purchase now!</p>
      <table class="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => {
            const imageSrc = item.imageUrl.startsWith('http')
              ? item.imageUrl
              : `${API_BASE}${item.imageUrl.startsWith('/') ? '' : '/'}${item.imageUrl}`;
            return `
              <tr>
                <td>
                  <img src="${imageSrc}" alt="${item.name}" />
                  ${item.name}
                </td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      <p><a href="http://localhost:3000/cart" class="cta">Shop Now</a></p>
    </div>
    <div class="footer">
      <p>Don't want these reminders? <a href="http://localhost:3000/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a></p>
      <p>© 2025 ShopEase. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Send cart reminder emails
const sendCartReminders = async () => {
  try {
    console.log('Starting cart reminder cron job...');
    const users = await User.find({ isVerified: true }).select('name email _id');
    if (users.length === 0) {
      console.log('No verified users found.');
      return;
    }
    let sentCount = 0;
    for (const user of users) {
      const cart = await Cart.findOne({ userId: user._id });
      if (!cart || cart.items.length === 0) {
        continue;
      }
      const transformedItems = cart.items.map(item => ({
        ...item.toObject(),
        imageUrl: item.imageUrl.startsWith('http')
          ? item.imageUrl
          : `${API_BASE}${item.imageUrl.startsWith('/') ? '' : '/'}${item.imageUrl}`,
      }));
      console.log(
        `Preparing cart reminder for ${user.email}:`,
        transformedItems.map(i => ({ name: i.name, imageUrl: i.imageUrl }))
      );
      const html = getCartReminderTemplate(user.name, user.email, transformedItems);
      await transporter.sendMail({
        from: `"ShopEase" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Your Cart Awaits, ${user.name}!`,
        html,
      });
      console.log(`Cart reminder email sent to ${user.email}`);
      sentCount++;
    }
    console.log(`Completed sending cart reminders to ${sentCount} users.`);
  } catch (err) {
    console.error('Error in cart reminder cron job:', err);
  }
};

// Schedule job every 10 minutes
const startCartReminderCron = () => {
  schedule.scheduleJob('*/10 * * * *', sendCartReminders);
  console.log('Cart reminder cron job scheduled (every 10 minutes).');
};

module.exports = { startCartReminderCron };