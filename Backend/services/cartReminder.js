


// // services/cartReminder.js
// const schedule = require('node-schedule');
// const nodemailer = require('nodemailer');
// const User = require('../models/User');
// const Cart = require('../models/Cart');
// const logger = require('../utils/logger');
// const { formatCurrency } = require('../utils/helpers');
// const crypto = require('crypto');

// const API_BASE = process.env.API_BASE || 'http://localhost:5000';
// const FRONTEND_BASE = process.env.FRONTEND_BASE || 'http://localhost:3000';

// // Email transporter configuration
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Verify transporter
// transporter.verify((error, success) => {
//   if (error) {
//     logger.error('Email transporter verification failed:', error);
//   } else {
//     logger.info('Email transporter is ready to send messages');
//   }
// });

// // Helper function to get proper image URL
// const getImageUrl = (imagePath) => {
//   if (!imagePath) return 'https://via.placeholder.com/80';
  
//   // If already a full URL, return as-is
//   if (imagePath.startsWith('http')) return imagePath;
  
//   // If relative path, construct full URL
//   return `${API_BASE}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
// };

// // Email template for cart reminder
// const getCartReminderTemplate = (name, email, items) => {
//   const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
//   return `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <style>
//     body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
//     .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//     .header { background: #007bff; color: white; padding: 20px; text-align: center; }
//     .product { display: flex; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
//     .product-image { width: 80px; height: 80px; object-fit: contain; margin-right: 15px; border: 1px solid #ddd; }
//     .product-info { flex: 1; }
//     .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
//     .cta-button { 
//       display: inline-block; 
//       background: #007bff; 
//       color: white; 
//       padding: 12px 25px; 
//       text-decoration: none; 
//       border-radius: 4px; 
//       font-weight: bold;
//       margin: 20px 0;
//     }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="header">
//       <h1>Your Cart is Waiting!</h1>
//     </div>
//     <p>Hi ${name},</p>
//     <p>You have ${items.length} item${items.length > 1 ? 's' : ''} waiting in your cart. Complete your purchase now!</p>
    
//     ${items.map(item => `
//       <div class="product">
//         <img src="${getImageUrl(item.imageUrl)}" 
//              class="product-image" 
//              alt="${item.name}"
//              onerror="this.src='https://via.placeholder.com/80?text=Product+Image'">
//         <div class="product-info">
//           <h3 style="margin-top: 0;">${item.name}</h3>
//           <p>Quantity: ${item.quantity}</p>
//           <p>Price: ${formatCurrency(item.price)}</p>
//           <p>Subtotal: ${formatCurrency(item.price * item.quantity)}</p>
//         </div>
//       </div>
//     `).join('')}
    
//     <h3 style="text-align: right;">Total: ${formatCurrency(total)}</h3>
//     <div style="text-align: center;">
//       <a href="${FRONTEND_BASE}/cart" class="cta-button">Complete Your Order</a>
//     </div>
    
//     <div class="footer">
//       <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'ShopEase'}</p>
//       <p>
//         <a href="${FRONTEND_BASE}/unsubscribe?email=${encodeURIComponent(email)}" 
//            style="color: #007bff; text-decoration: none;">
//           Unsubscribe from these reminders
//         </a>
//       </p>
//     </div>
//   </div>
// </body>
// </html>
//   `;
// };

// // Send cart reminder emails
// const sendCartReminders = async () => {
//   try {
//     logger.info('Starting cart reminder job...');
    
//     const users = await User.find({ isVerified: true });
//     if (!users || users.length === 0) {
//       logger.info('No verified users found for cart reminders');
//       return;
//     }

//     let sentCount = 0;
    
//     for (const user of users) {
//       try {
//         const cart = await Cart.findOne({ user: user._id }).populate('items.product');
//         if (!cart || cart.items.length === 0) continue;

//         const items = cart.items.map(item => ({
//           name: item.product.name,
//           price: item.product.price,
//           quantity: item.quantity,
//           imageUrl: item.product.imageUrl,
//           productId: item.product._id
//         }));

//         const mailOptions = {
//           from: `"${process.env.EMAIL_SENDER_NAME || 'ShopEase'}" <${process.env.EMAIL_USER}>`,
//           to: user.email,
//           subject: `⏳ Complete Your Purchase - ${items.length} Item${items.length > 1 ? 's' : ''} in Cart`,
//           html: getCartReminderTemplate(user.name, user.email, items),
//           // Important for Gmail to display images properly
//           headers: {
//             'X-MSMail-Priority': 'High',
//             'Importance': 'High',
//             'X-Priority': '1'
//           }
//         };

//         await transporter.sendMail(mailOptions);
//         sentCount++;
//         logger.info(`Cart reminder sent to ${user.email}`);
//       } catch (error) {
//         logger.error(`Failed to send reminder to ${user.email}:`, error);
//       }
//     }

//     logger.info(`Cart reminders sent to ${sentCount} users`);
//   } catch (error) {
//     logger.error('Error in cart reminder job:', error);
//     throw error;
//   }
// };

// // Schedule job every 10 minutes
// const startCartReminderCron = () => {
//   try {
//     // Run immediately in development for testing
//     if (process.env.NODE_ENV === 'development') {
//       sendCartReminders();
//     }

//     // Schedule recurring job
//     const job = schedule.scheduleJob('*/1 * * * *', async () => {
//       try {
//         await sendCartReminders();
//       } catch (error) {
//         logger.error('Cart reminder job failed:', error);
//       }
//     });

//     logger.info('Cart reminder cron job scheduled (every 10 minutes)');
//     return job;
//   } catch (error) {
//     logger.error('Failed to start cart reminder cron job:', error);
//     throw error;
//   }
// };

// module.exports = { startCartReminderCron };









const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Cart = require('../models/Cart');
const logger = require('../utils/logger');
const { formatCurrency } = require('../utils/helpers');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const API_BASE = process.env.API_BASE || 'http://localhost:5000';
const FRONTEND_BASE = process.env.FRONTEND_BASE || 'http://localhost:3000';

// Email transporter configuration
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
    logger.error('Email transporter verification failed:', error);
  } else {
    logger.info('Email transporter is ready to send messages');
  }
});

// Helper function to prepare email attachments
const prepareAttachments = (items) => {
  const defaultPlaceholder = path.join('public', 'uploads', 'placeholder.jpg');
  const attachments = [];
  
  items.forEach((item, index) => {
    let imagePath = item.imageUrl 
      ? path.join('public', item.imageUrl.replace(/^http:\/\/localhost:5000\//, ''))
      : defaultPlaceholder;

    // Ensure path uses correct separators for the OS
    imagePath = imagePath.replace(/\//g, path.sep);

    if (!fs.existsSync(imagePath)) {
      logger.warn(`Image file not found: ${imagePath}, using default placeholder`);
      imagePath = defaultPlaceholder;
    }

    attachments.push({
      filename: `product-${index}.jpg`,
      path: imagePath,
      cid: `product-${index}@cart`, // Unique CID for each image
    });
  });

  return attachments;
};

// Email template for cart reminder
const getCartReminderTemplate = (name, email, items) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #007bff; color: white; padding: 20px; text-align: center; }
    .product { display: flex; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
    .product-image { width: 80px; height: 80px; object-fit: contain; margin-right: 15px; border: 1px solid #ddd; }
    .product-info { flex: 1; }
    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
    .cta-button { 
      display: inline-block; 
      background: #007bff; 
      color: white; 
      padding: 12px 25px; 
      text-decoration: none; 
      border-radius: 4px; 
      font-weight: bold;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Cart is Waiting!</h1>
    </div>
    <p>Hi ${name},</p>
    <p>You have ${items.length} item${items.length > 1 ? 's' : ''} waiting in your cart. Complete your purchase now!</p>
    
    ${items.map((item, index) => `
      <div class="product">
        <img src="cid:product-${index}@cart" 
             class="product-image" 
             alt="${item.name}"
             onerror="this.src='https://via.placeholder.com/80?text=Product+Image'">
        <div class="product-info">
          <h3 style="margin-top: 0;">${item.name}</h3>
          <p>Quantity: ${item.quantity}</p>
          <p>Price: ${formatCurrency(item.price)}</p>
          <p>Subtotal: ${formatCurrency(item.price * item.quantity)}</p>
        </div>
      </div>
    `).join('')}
    
    <h3 style="text-align: right;">Total: ${formatCurrency(total)}</h3>
    <div style="text-align: center;">
      <a href="${FRONTEND_BASE}/cart" class="cta-button">Complete Your Order</a>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'ShopEase'}</p>
      <p>
        <a href="${FRONTEND_BASE}/unsubscribe?email=${encodeURIComponent(email)}" 
           style="color: #007bff; text-decoration: none;">
          Unsubscribe from these reminders
        </a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Send cart reminder emails
const sendCartReminders = async () => {
  try {
    logger.info('Starting cart reminder job...');
    
    const users = await User.find({ isVerified: true });
    if (!users || users.length === 0) {
      logger.info('No verified users found for cart reminders');
      return;
    }

    let sentCount = 0;
    
    for (const user of users) {
      try {
        const cart = await Cart.findOne({ user: user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) continue;

        const items = cart.items.map(item => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
          productId: item.product._id
        }));

        // Prepare email attachments
        const attachments = prepareAttachments(items);
        const html = getCartReminderTemplate(user.name, user.email, items);

        const mailOptions = {
          from: `"${process.env.EMAIL_SENDER_NAME || 'ShopEase'}" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `⏳ Complete Your Purchase - ${items.length} Item${items.length > 1 ? 's' : ''} in Cart`,
          html,
          attachments,
          headers: {
            'X-MSMail-Priority': 'High',
            'Importance': 'High',
            'X-Priority': '1'
          }
        };

        await transporter.sendMail(mailOptions);
        sentCount++;
        logger.info(`Cart reminder sent to ${user.email}`);
      } catch (error) {
        logger.error(`Failed to send reminder to ${user.email}:`, error);
      }
    }

    logger.info(`Cart reminders sent to ${sentCount} users`);
  } catch (error) {
    logger.error('Error in cart reminder job:', error);
    throw error;
  }
};

// Schedule job every 10 minutes
const startCartReminderCron = () => {
  try {
    // Run immediately in development for testing
    if (process.env.NODE_ENV === 'development') {
      sendCartReminders();
    }

    // Schedule recurring job
    const job = schedule.scheduleJob('*/60 * * * *', async () => {
      try {
        await sendCartReminders();
      } catch (error) {
        logger.error('Cart reminder job failed:', error);
      }
    });

    logger.info('Cart reminder cron job scheduled (every 10 minutes)');
    return job;
  } catch (error) {
    logger.error('Failed to start cart reminder cron job:', error);
    throw error;
  }
};

module.exports = { startCartReminderCron };