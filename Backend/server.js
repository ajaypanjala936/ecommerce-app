

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const authRoutes = require('./routes/authRoutes');
// const orderRoutes = require('./routes/orders');
// const productRoutes = require('./routes/products');
// const chatRoutes = require('./routes/chat');
// const walletRoutes = require('./routes/wallet');
// const contactRoutes = require('./routes/contact');
// const notificationRoutes = require('./routes/notifications');
// const reviewRoutes = require('./routes/reviewRoutes');
// const { startOrderStatusCron } = require('./jobs/orderStatusCron');
// const newsletterRoutes = require('./routes/newsletter');

// const app = express();

// // Middleware
// app.use(cors({ origin: 'http://localhost:3000' }));
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// // Routes
// app.use('/api/auth', authRoutes.router); // Note: Assuming authRoutes exports { router }
// app.use('/api/orders', orderRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api', walletRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/products', reviewRoutes);
// app.use('/api/newsletter', newsletterRoutes);

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
//   serverSelectionTimeoutMS: 5000, // Timeout after 5s
//   connectTimeoutMS: 10000, // Connection timeout
//   socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
// })
//   .then(() => {
//     console.log('✅ MongoDB connected successfully');
//     // Start cron job for order status updates
//     startOrderStatusCron();
//   })
//   .catch(err => console.error('MongoDB connection error:', err));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📡 Static files served from ${path.join(__dirname, 'public/uploads')}`);
// });


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const authRoutes = require('./routes/authRoutes');
// const orderRoutes = require('./routes/orders');
// const productRoutes = require('./routes/products');
// const chatRoutes = require('./routes/chat');
// const walletRoutes = require('./routes/wallet');
// const contactRoutes = require('./routes/contact');
// const notificationRoutes = require('./routes/notifications');
// const reviewRoutes = require('./routes/reviewRoutes');
// const newsletterRoutes = require('./routes/newsletter');
// const { startOrderStatusCron } = require('./jobs/orderStatusCron');
// // const { startNewsletterOfferCron } = require('./jobs/newsletterCron');
// // const { startUserEmailCron } = require('./jobs/userEmailCron');
// // const { startCartReminderCron } = require('./jobs/cartReminderCron');
// const cartRoutes = require('./routes/cart');
// const { startCartReminderCron } = require('./services/cartReminder');
// const userPreferencesRouter = require('./routes/userPreferences');
// const app = express();

// // Middleware
// app.use(cors({ origin: 'http://localhost:3000' }));
// app.use(express.json());
// app.use('/Uploads', express.static(path.join(__dirname, 'public/uploads')));

// // Routes
// app.use('/api/auth', authRoutes.router || authRoutes);
// app.use('/api/orders', orderRoutes.router || orderRoutes);
// app.use('/api/products', productRoutes.router || productRoutes);
// app.use('/api/contact', contactRoutes.router || contactRoutes);
// app.use('/api', walletRoutes.router || walletRoutes);
// app.use('/api/chat', chatRoutes.router || chatRoutes);
// app.use('/api/notifications', notificationRoutes.router || notificationRoutes);
// app.use('/api/products', reviewRoutes.router || reviewRoutes);
// // app.use('/api/newsletter', newsletterRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/preferences', userPreferencesRouter);
// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
//   serverSelectionTimeoutMS: 5000,
//   connectTimeoutMS: 10000,
//   socketTimeoutMS: 45000,
// })
//   .then(() => {
//     console.log('✅ MongoDB connected successfully');
//     startOrderStatusCron();
//     // startNewsletterOfferCron();
//     // startUserEmailCron();
//     startCartReminderCron();
//   })
//   .catch(err => console.error('MongoDB connection error:', err));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📡 Static files served from ${path.join(__dirname, 'public/uploads')}`);
// });







// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const orderRoutes = require('./routes/orders');
// const productRoutes = require('./routes/products');
// const chatRoutes = require('./routes/chat');
// const walletRoutes = require('./routes/wallet');
// const contactRoutes = require('./routes/contact');
// const notificationRoutes = require('./routes/notifications');
// const reviewRoutes = require('./routes/reviewRoutes');
// const newsletterRoutes = require('./routes/newsletter');
// const cartRoutes = require('./routes/cart');
// const userPreferencesRouter = require('./routes/userPreferences');

// // Import cron jobs
// const { startOrderStatusCron } = require('./jobs/orderStatusCron');
// const { startCartReminderCron } = require('./services/cartReminder');

// // Import logger
// const logger = require('./utils/logger');

// const app = express();

// // Create logs directory if it doesn't exist
// const fs = require('fs');
// const logsDir = path.join(__dirname, 'logs');
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir);
// }

// // Middleware
// app.use(cors({ origin: 'http://localhost:3000' }));
// app.use(express.json());
// app.use('/Uploads', express.static(path.join(__dirname, 'public/uploads')));

// // Log requests
// app.use((req, res, next) => {
//   logger.info(`${req.method} ${req.url}`);
//   next();
// });

// // Routes
// app.use('/api/auth', authRoutes.router || authRoutes);
// app.use('/api/orders', orderRoutes.router || orderRoutes);
// app.use('/api/products', productRoutes.router || productRoutes);
// app.use('/api/contact', contactRoutes.router || contactRoutes);
// app.use('/api', walletRoutes.router || walletRoutes);
// app.use('/api/chat', chatRoutes.router || chatRoutes);
// app.use('/api/notifications', notificationRoutes.router || notificationRoutes);
// app.use('/api/products', reviewRoutes.router || reviewRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/preferences', userPreferencesRouter);
// app.use('/api/newsletter', newsletterRoutes);
// // Error handling middleware
// app.use((err, req, res, next) => {
//   logger.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
//   serverSelectionTimeoutMS: 5000,
//   connectTimeoutMS: 10000,
//   socketTimeoutMS: 45000,
// })
//   .then(() => {
//     logger.info('✅ MongoDB connected successfully');
    
//     // Start cron jobs
//     try {
//       startOrderStatusCron();
//       startCartReminderCron();
//       startNewsletterOfferCron();
//        startUserEmailCron();
//       logger.info('Cron jobs started successfully');
//     } catch (error) {
//       logger.error('Failed to start cron jobs:', error);
//     }
//   })
//   .catch(err => {
//     logger.error('MongoDB connection error:', err);
//     process.exit(1);
//   });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   logger.info(`🚀 Server running on http://localhost:${PORT}`);
//   logger.info(`📡 Static files served from ${path.join(__dirname, 'public/uploads')}`);
// });

// // Handle shutdown gracefully
// process.on('SIGINT', () => {
//   logger.info('Shutting down server...');
//   mongoose.connection.close(false, () => {
//     logger.info('MongoDB connection closed');
//     process.exit(0);
//   });
// });








const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const chatRoutes = require('./routes/chat');
const walletRoutes = require('./routes/wallet');
const contactRoutes = require('./routes/contact');
const notificationRoutes = require('./routes/notifications');
const reviewRoutes = require('./routes/reviewRoutes');
const newsletterRoutes = require('./routes/newsletter');
const cartRoutes = require('./routes/cart');
const userPreferencesRouter = require('./routes/userPreferences');

// Import cron jobs
// const { startOrderStatusCron } = require('./jobs/orderStatusCron');
// const { startCartReminderCron } = require('./services/cartReminder');
// const { startNewsletterOfferCron } = require('./jobs/newsletterCron');
// const { startUserEmailCron } = require('./jobs/userEmailCron');
// const { startOrderStatusCron } = require('./jobs/cron');
// Import logger
const logger = require('./utils/logger');

const app = express();

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/Uploads', express.static(path.join(__dirname, 'public/uploads')));

// Log requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes.router || authRoutes);
app.use('/api/orders', orderRoutes.router || orderRoutes);
app.use('/api/products', productRoutes.router || productRoutes);
app.use('/api/contact', contactRoutes.router || contactRoutes);
app.use('/api', walletRoutes.router || walletRoutes);
app.use('/api/chat', chatRoutes.router || chatRoutes);
app.use('/api/notifications', notificationRoutes.router || notificationRoutes);
app.use('/api/products', reviewRoutes.router || reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/preferences', userPreferencesRouter);
app.use('/api/newsletter', newsletterRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    logger.info('✅ MongoDB connected successfully');
    
    // Start cron jobs
    try {
      // startOrderStatusCron();
      // startCartReminderCron();
      // startNewsletterOfferCron();
      // startUserEmailCron();
      logger.info('Cron jobs started successfully');
    } catch (error) {
      logger.error('Failed to start cron jobs:', error);
    }
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📡 Static files served from ${path.join(__dirname, 'public/uploads')}`);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  logger.info('Shutting down server...');
  mongoose.connection.close(false, () => {
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
});





