// const mongoose = require('mongoose');
// const cron = require('node-cron');
// const Order = require('../models/Order');
// const axios = require('axios');
// const { updateToDelivered } = require('../routes/deliveredStatus');

// const refreshAdminToken = async () => {
//   try {
//     console.log('Attempting to refresh admin token with:', {
//       email: process.env.ADMIN_EMAIL,
//       apiBase: process.env.API_BASE || 'http://localhost:5000',
//     });
//     const response = await axios.post(
//       `${process.env.API_BASE || 'http://localhost:5000'}/api/auth/login`,
//       {
//         email: process.env.ADMIN_EMAIL,
//         password: process.env.ADMIN_PASSWORD,
//       },
//       {
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//     const token = response.data.token;
//     if (!token) {
//       throw new Error('No token received in login response');
//     }
//     console.log('Admin JWT token refreshed:', token.substring(0, 10) + '...');
//     return token;
//   } catch (err) {
//     console.error('Failed to refresh admin token:', err.response?.data || err.message, err.stack);
//     throw err;
//   }
// };

// const updateOrderStatuses = async () => {
//   let adminToken;
//   try {
//     // Refresh admin token for Pending and Processing updates
//     adminToken = await refreshAdminToken();
//     console.log('Using admin token:', adminToken.substring(0, 10) + '...');

//     const now = new Date();
//     console.log(`Checking order statuses at ${now.toISOString()}`);

//     // Update Pending -> Processing (1 minute)
//     const pendingThreshold = new Date(now.getTime() - 1 * 60 * 1000);
//     const pendingOrders = await Order.find({
//       status: 'Pending',
//       createdAt: { $lte: pendingThreshold },
//     });

//     for (const order of pendingOrders) {
//       try {
//         const response = await axios.patch(
//           `${process.env.API_BASE || 'http://localhost:5000'}/api/orders/${order._id}/status`,
//           { status: 'Processing' },
//           {
//             headers: {
//               Authorization: `Bearer ${adminToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         console.log(`Order ${order._id} updated to Processing via API:`, response.data);
//       } catch (err) {
//         console.error(`Failed to update order ${order._id} to Processing:`, err.response?.data || err.message);
//       }
//     }

//     // Update Processing -> Shipped (2 minutes)
//     const shippedThreshold = new Date(now.getTime() - 2 * 60 * 1000);
//     const processingOrders = await Order.find({
//       status: 'Processing',
//       createdAt: { $lte: shippedThreshold },
//     });

//     for (const order of processingOrders) {
//       try {
//         const response = await axios.patch(
//           `${process.env.API_BASE || 'http://localhost:5000'}/api/orders/${order._id}/status`,
//           { status: 'Ship Illusion: The Art of Deceptionped' },
//           {
//             headers: {
//               Authorization: `Bearer ${adminToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         console.log(`Order ${order._id} updated to Shipped via API:`, response.data);
//       } catch (err) {
//         console.error(`Failed to update order ${order._id} to Shipped:`, err.response?.data || err.message);
//       }
//     }

//     // Update Shipped -> Delivered (3 minutes)
//     const deliveredThreshold = new Date(now.getTime() - 3 * 60 * 1000);
//     const shippedOrders = await Order.find({
//       status: 'Shipped',
//       createdAt: { $lte: deliveredThreshold },
//     });

//     for (const order of shippedOrders) {
//       try {
//         const result = await updateToDelivered(order._id);
//         console.log(`Order ${order._id} processed for delivery:`, result);
//       } catch (err) {
//         console.error(`Failed to update order ${order._id} to Delivered:`, err.message);
//       }
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
// const axios = require('axios');
// const { updateToDelivered } = require('../routes/deliveredStatus');

// const refreshAdminToken = async () => {
//   try {
//     console.log('Attempting to refresh admin token with:', {
//       email: process.env.ADMIN_EMAIL,
//       apiBase: process.env.API_BASE || 'http://localhost:5000',
//     });
//     const response = await axios.post(
//       `${process.env.API_BASE || 'http://localhost:5000'}/api/auth/login`,
//       {
//         email: process.env.ADMIN_EMAIL,
//         password: process.env.ADMIN_PASSWORD,
//       },
//       {
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//     const token = response.data.token;
//     if (!token) {
//       throw new Error('No token received in login response');
//     }
//     console.log('Admin JWT token refreshed:', token.substring(0, 10) + '...');
//     return token;
//   } catch (err) {
//     console.error('Failed to refresh admin token:', err.response?.data || err.message, err.stack);
//     throw err;
//   }
// };

// const updateOrderStatuses = async () => {
//   let adminToken;
//   try {
//     // Refresh admin token for Pending and Processing updates
//     adminToken = await refreshAdminToken();
//     console.log('Using admin token:', adminToken.substring(0, 10) + '...');

//     const now = new Date();
//     console.log(`Checking order statuses at ${now.toISOString()}`);

//     // Update Pending -> Processing (1 minute)
//     const pendingThreshold = new Date(now.getTime() - 1 * 60 * 1000);
//     const pendingOrders = await Order.find({
//       status: 'Pending',
//       createdAt: { $lte: pendingThreshold },
//     });

//     for (const order of pendingOrders) {
//       try {
//         console.log(`Attempting to update order ${order._id} to Processing`);
//         const response = await axios.patch(
//           `${process.env.API_BASE || 'http://localhost:5000'}/api/orders/${order._id}/status`,
//           { status: 'Processing' },
//           {
//             headers: {
//               Authorization: `Bearer ${adminToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         console.log(`Order ${order._id} updated to Processing via API:`, response.data);
//       } catch (err) {
//         console.error(`Failed to update order ${order._id} to Processing:`, err.response?.data || err.message);
//       }
//     }

//     // Update Processing -> Shipped (2 minutes)
//     const shippedThreshold = new Date(now.getTime() - 2 * 60 * 1000);
//     const processingOrders = await Order.find({
//       status: 'Processing',
//       createdAt: { $lte: shippedThreshold },
//     });

//     for (const order of processingOrders) {
//       try {
//         console.log(`Attempting to update order ${order._id} to Shipped`);
//         const response = await axios.patch(
//           `${process.env.API_BASE || 'http://localhost:5000'}/api/orders/${order._id}/status`,
//           { status: 'Shipped' },
//           {
//             headers: {
//               Authorization: `Bearer ${adminToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         console.log(`Order ${order._id} updated to Shipped via API:`, response.data);
//       } catch (err) {
//         console.error(`Failed to update order ${order._id} to Shipped:`, err.response?.data || err.message);
//       }
//     }

//     // Update Shipped -> Delivered (3 minutes)
//     const deliveredThreshold = new Date(now.getTime() - 3 * 60 * 1000);
//     const shippedOrders = await Order.find({
//       status: 'Shipped',
//       createdAt: { $lte: deliveredThreshold },
//     });

//     for (const order of shippedOrders) {
//       try {
//         const result = await updateToDelivered(order._id);
//         console.log(`Order ${order._id} processed for delivery:`, result);
//       } catch (err) {
//         console.error(`Failed to update order ${order._id} to Delivered:`, err.message);
//       }
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







const mongoose = require('mongoose');
const cron = require('node-cron');
const Order = require('../models/Order');
const axios = require('axios');
const { updateToDelivered } = require('../routes/deliveredStatus');

const refreshAdminToken = async () => {
  try {
    console.log('Attempting to refresh admin token with:', {
      email: process.env.ADMIN_EMAIL,
      apiBase: process.env.API_BASE || 'http://localhost:5000',
    });
    const response = await axios.post(
      `${process.env.API_BASE || 'http://localhost:5000'}/api/auth/login`,
      {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const token = response.data.token;
    if (!token) {
      throw new Error('No token received in login response');
    }
    console.log('Admin JWT token refreshed:', token.substring(0, 10) + '...');
    return token;
  } catch (err) {
    console.error('Failed to refresh admin token:', err.response?.data || err.message, err.stack);
    throw err;
  }
};

const updateOrderStatuses = async () => {
  let adminToken;
  try {
    // Refresh admin token for Pending and Shipped updates
    adminToken = await refreshAdminToken();
    console.log('Using admin token:', adminToken.substring(0, 10) + '...');

    const now = new Date();
    console.log(`Checking order statuses at ${now.toISOString()}`);

    // Update Pending -> Shipped (1 minute)
    const shippedThreshold = new Date(now.getTime() - 1 * 60 * 1000);
    const pendingOrders = await Order.find({
      status: 'Pending',
      createdAt: { $lte: shippedThreshold },
    });

    for (const order of pendingOrders) {
      try {
        console.log(`Attempting to update order ${order._id} to Shipped`);
        const response = await axios.patch(
          `${process.env.API_BASE || 'http://localhost:5000'}/api/orders/${order._id}/status`,
          { status: 'Shipped' },
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(`Order ${order._id} updated to Shipped via API:`, response.data);
      } catch (err) {
        console.error(`Failed to update order ${order._id} to Shipped:`, err.response?.data || err.message);
      }
    }

    // Update Shipped -> Delivered (2 minutes)
    const deliveredThreshold = new Date(now.getTime() - 10 * 60 * 1000);
    const shippedOrders = await Order.find({
      status: 'Shipped',
      createdAt: { $lte: deliveredThreshold },
    });

    for (const order of shippedOrders) {
      try {
        const result = await updateToDelivered(order._id);
        console.log(`Order ${order._id} processed for delivery:`, result);
      } catch (err) {
        console.error(`Failed to update order ${order._id} to Delivered:`, err.message);
      }
    }
  } catch (err) {
    console.error('Error updating order statuses:', err.message, err.stack);
  }
};

// Schedule cron job to run every minute
const startOrderStatusCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      if (!mongoose.connection.readyState) {
        console.warn('MongoDB not connected, skipping cron job');
        return;
      }
      await updateOrderStatuses();
    } catch (err) {
      console.error('Cron job error:', err.message);
    }
  });
  console.log('Order status cron job scheduled');
};

module.exports = { startOrderStatusCron };