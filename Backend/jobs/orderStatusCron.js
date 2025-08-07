// const mongoose = require('mongoose');
// const cron = require('node-cron');
// const Order = require('../models/Order');

// // Function to update order statuses
// const updateOrderStatuses = async () => {
//   try {
//     const now = new Date();
//     console.log(`Checking order statuses at ${now.toISOString()}`);

//     // Update Pending -> Processing (30 minutes)
//     const pendingThreshold = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago
//     const pendingOrders = await Order.find({
//       status: 'Pending',
//       createdAt: { $lte: pendingThreshold },
//     });

//     for (const order of pendingOrders) {
//       order.status = 'Processing';
//       await order.save();
//       console.log(`Order ${order._id} updated to Processing`);
//     }

//     // Update Processing -> Shipped (1 hour from creation)
//     const shippedThreshold = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
//     const processingOrders = await Order.find({
//       status: 'Processing',
//       createdAt: { $lte: shippedThreshold },
//     });

//     for (const order of processingOrders) {
//       order.status = 'Shipped';
//       await order.save();
//       console.log(`Order ${order._id} updated to Shipped`);
//     }

//     // Update Shipped -> Delivered (5 days from creation)
//     const deliveredThreshold = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // 5 days ago
//     const shippedOrders = await Order.find({
//       status: 'Shipped',
//       createdAt: { $lte: deliveredThreshold },
//     });

//     for (const order of shippedOrders) {
//       order.status = 'Delivered';
//       await order.save();
//       console.log(`Order ${order._id} updated to Delivered`);
//     }
//   } catch (err) {
//     console.error('Error updating order statuses:', err.message, err.stack);
//   }
// };

// // Schedule cron job to run every minute
// const startOrderStatusCron = () => {
//   cron.schedule('* * * * *', async () => {
//     try {
//       if (!mongoose.connection.readyState) {
//         console.warn('MongoDB not connected, skipping cron job');
//         return;
//       }
//       await updateOrderStatuses();
//     } catch (err) {
//       console.error('Cron job error:', err.message);
//     }
//   });
//   console.log('Order status cron job scheduled');
// };

// module.exports = { startOrderStatusCron };



// const mongoose = require('mongoose');
// const cron = require('node-cron');
// const Order = require('../models/Order');


// // Function to update order statuses
// const updateOrderStatuses = async () => {
//   try {
//     const now = new Date();
//     console.log(`Checking order statuses at ${now.toISOString()}`);

//     // Update Pending -> Processing (2 minutes)
//     const pendingThreshold = new Date(now.getTime() - 1 * 60 * 1000); // 2 minutes ago
//     const pendingOrders = await Order.find({
//       status: 'Pending',
//       createdAt: { $lte: pendingThreshold },
//     });

//     for (const order of pendingOrders) {
//       order.status = 'Processing';
//       await order.save();
//       console.log(`Order ${order._id} updated to Processing`);
//     }

//     // Update Processing -> Shipped (5 minutes from creation)
//     const shippedThreshold = new Date(now.getTime() - 2 * 60 * 1000); // 5 minutes ago
//     const processingOrders = await Order.find({
//       status: 'Processing',
//       createdAt: { $lte: shippedThreshold },
//     });

//     for (const order of processingOrders) {
//       order.status = 'Shipped';
//       await order.save();
//       console.log(`Order ${order._id} updated to Shipped`);
//     }

//     // Update Shipped -> Delivered (10 minutes from creation)
//     const deliveredThreshold = new Date(now.getTime() - 3 * 60 * 1000); // 10 minutes ago
//     const shippedOrders = await Order.find({
//       status: 'Shipped',
//       createdAt: { $lte: deliveredThreshold },
//     });

//     for (const order of shippedOrders) {
//       order.status = 'Delivered';
//       order.deliveredAt = new Date(); // Set deliveredAt when marking as Delivered
//       await order.save();
//       console.log(`Order ${order._id} updated to Delivered with deliveredAt: ${order.deliveredAt}`);
//     }
//   } catch (err) {
//     console.error('Error updating order statuses:', err.message, err.stack);
//   }
// };

// // Schedule cron job to run every minute
// const startOrderStatusCron = () => {
//   cron.schedule('* * * * *', async () => {
//     try {
//       if (!mongoose.connection.readyState) {
//         console.warn('MongoDB not connected, skipping cron job');
//         return;
//       }
//       await updateOrderStatuses();
//     } catch (err) {
//       console.error('Cron job error:', err.message);
//     }
//   });
//   console.log('Order status cron job scheduled');
// };

// module.exports = { startOrderStatusCron };