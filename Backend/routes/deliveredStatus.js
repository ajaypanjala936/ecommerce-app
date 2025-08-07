




const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const path = require('path');
const fs = require('fs');

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Normalize image URL for backend
const normalizeImageUrl = (imageUrl) => {
  const defaultPlaceholder = 'Uploads/placeholder.jpg';
  if (!imageUrl) return defaultPlaceholder;
  const normalized = imageUrl
    .replace(/^http:\/\/localhost:5000/, '')
    .replace(/^\/?[Uu]ploads\//, 'Uploads/');
  return normalized.startsWith('Uploads/') ? normalized : defaultPlaceholder;
};

// Email Template for Delivery Confirmation
const generateDeliveryEmailContent = (order) => {
  const productNames = order.items.map((item) => item.name).join(', ');
  const defaultPlaceholder = 'Uploads/placeholder.jpg';
  const API_BASE = process.env.API_BASE || 'http://localhost:5000';
  const feedbackUrl = `${API_BASE}/review/${order._id}`;

  const itemsHtml = order.items
    .map((item, index) => {
      let imageUrl = normalizeImageUrl(item.imageUrl);
      const imagePath = path.join(__dirname, '..', 'public', imageUrl);
      let finalImageUrl = imageUrl;

      if (!fs.existsSync(imagePath)) {
        console.warn(`Image file not found for ${item.name}: ${imagePath}, using default placeholder`);
        finalImageUrl = defaultPlaceholder;
      }

      const cid = `image-${index}@ecommerce`;
      const fallbackUrl = `${API_BASE}/${finalImageUrl.replace(/\\/g, '/')}`;

      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <img src="cid:${cid}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.src='${fallbackUrl}'" />
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #28a745; text-align: center;">Order Delivered!</h2>
      <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
      <p style="color: #555; text-align: center;">Your order #${order._id} for ${productNames} has been successfully delivered!</p>

      <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f1faff; color: #333;">
            <th style="padding: 10px; text-align: left;">Image</th>
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: left;">Quantity</th>
            <th style="padding: 10px; text-align: left;">Price</th>
            <th style="padding: 10px; text-align: left;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <h3 style="color: #333; margin-top: 20px;">Order Totals</h3>
      <table style="width: 100%; color: #555;">
        <tr>
          <td style="padding: 5px;">Subtotal</td>
          <td style="padding: 5px; text-align: right;">₹${order.totals.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">GST (18%)</td>
          <td style="padding: 5px; text-align: right;">₹${order.totals.gstAmount.toFixed(2)}</td>
        </tr>
        ${
          order.totals.promoDiscount > 0
            ? `
              <tr style="color: #28a745;">
                <td style="padding: 5px;">Promo Discount</td>
                <td style="padding: 5px; text-align: right;">-₹${order.totals.promoDiscount.toFixed(2)}</td>
              </tr>
            `
            : ''
        }
        ${
          order.totals.walletAmountUsed > 0
            ? `
              <tr style="color: #28a745;">
                <td style="padding: 5px;">Wallet Payment</td>
                <td style="padding: 5px; text-align: right;">-₹${order.totals.walletAmountUsed.toFixed(2)}</td>
              </tr>
            `
            : ''
        }
        <tr>
          <td style="padding: 5px;">Total (Before Payments)</td>
          <td style="padding: 5px; text-align: right;">₹${order.totals.baseTotal.toFixed(2)}</td>
        </tr>
        <tr style="font-weight: bold; color: #333;">
          <td style="padding: 5px;">Final Payment</td>
          <td style="padding: 5px; text-align: right;">₹${order.totals.totalAmount.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">Shipping</td>
          <td style="padding: 5px; text-align: right;">FREE</td>
        </tr>
      </table>

      <h3 style="color: #333; margin-top: 20px;">Shipping Information</h3>
      <p style="color: #555;">
        <strong>Name:</strong> ${order.shipping.name || 'N/A'}<br />
        <strong>Address:</strong> ${order.shipping.address || 'N/A'}, ${order.shipping.city || 'N/A'}, ${order.shipping.postalCode || 'N/A'}<br />
        <strong>Phone:</strong> ${order.shipping.phone || 'N/A'}<br />
        <strong>Email:</strong> ${order.shipping.email || 'N/A'}
      </p>

      <h3 style="color: #333; margin-top: 20px;">We Value Your Feedback!</h3>
      <p style="color: #555; text-align: center;">
        Please share your experience by rating and reviewing the products you received. Your feedback helps us improve!
      </p>
      <p style="text-align: center;">
        <a href="${feedbackUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Rate & Review Products</a>
      </p>

      <p style="color: #555; text-align: center; margin-top: 20px;">
        If you have any issues, contact us at support@example.com.
      </p>
      <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
    </div>
  `;

  const attachments = order.items
    .map((item, index) => {
      let imageUrl = normalizeImageUrl(item.imageUrl);
      let imagePath = path.join(__dirname, '..', 'public', imageUrl);

      if (!fs.existsSync(imagePath)) {
        console.warn(`Image file not found for ${item.name}: ${imagePath}, using default placeholder`);
        imageUrl = defaultPlaceholder;
        imagePath = path.join(__dirname, '..', 'public', imageUrl);
      }

      if (!fs.existsSync(imagePath)) {
        console.error(`Skipping attachment for ${item.name}: ${imagePath} does not exist`);
        return null;
      }

      console.log(`Attaching image for ${item.name}:`, { imageUrl, imagePath, exists: fs.existsSync(imagePath) });

      return {
        filename: path.basename(imageUrl),
        path: imagePath,
        cid: `image-${index}@ecommerce`,
      };
    })
    .filter((attachment) => attachment !== null);

  return { html: htmlContent, attachments };
};

// Update order status to Delivered and send email
const updateToDelivered = async (orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(`Processing delivery for order: ${orderId}`);

    // Fetch order
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      await session.abortTransaction();
      session.endSession();
      throw new Error('Order not found');
    }

    // Check if already Delivered
    if (order.status === 'Delivered') {
      console.warn(`Order ${orderId} already delivered`);
      await session.commitTransaction();
      session.endSession();
      return { success: false, message: 'Order already delivered' };
    }

    // Validate status
    if (order.status !== 'Shipped') {
      console.error(`Order ${orderId} not in Shipped status: ${order.status}`);
      await session.abortTransaction();
      session.endSession();
      throw new Error('Order must be in Shipped status to be marked Delivered');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(order.shipping.email)) {
      console.error(`Invalid email address for order ${orderId}: ${order.shipping.email}`);
      await session.abortTransaction();
      session.endSession();
      throw new Error('Invalid email address');
    }

    // Update order status
    order.status = 'Delivered';
    order.deliveredAt = new Date();
    await order.save({ session });
    console.log(`Order ${orderId} updated to Delivered at: ${order.deliveredAt}`);

    // Generate and send delivery email
    const { html, attachments } = generateDeliveryEmailContent(order);
    const mailOptions = {
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to: order.shipping.email,
      subject: `Order #${order._id} Delivered`,
      html,
      attachments,
    };

    console.log('Delivery email options:', {
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject,
      attachments: attachments.map((a) => ({ filename: a.filename, path: a.path, cid: a.cid })),
    });

    await transporter.sendMail(mailOptions);
    console.log(`Delivery confirmation email sent to: ${order.shipping.email}`);

    // Create delivery notification
    const productNames = order.items.map((item) => item.name).join(', ');
    const notification = new Notification({
      userId: order.shipping.userId,
      message: `Order #${order._id} for ${productNames} has been delivered`,
      imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
      totalPrice: order.totals.baseTotal,
      isRead: false,
    });
    await notification.save({ session });
    console.log('Delivery notification created:', {
      userId: order.shipping.userId,
      message: notification.message,
      imageUrl: notification.imageUrl,
      totalPrice: notification.totalPrice,
    });

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: `Order ${orderId} marked as Delivered and email sent` };
  } catch (err) {
    console.error(`Error updating order ${orderId} to Delivered:`, err.message, err.stack);
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

module.exports = { updateToDelivered };






// const mongoose = require('mongoose');
// const nodemailer = require('nodemailer');
// const Order = require('../models/Order');
// const Notification = require('../models/Notification');
// const path = require('path');
// const fs = require('fs');

// // Nodemailer Transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Normalize image URL for backend
// const normalizeImageUrl = (imageUrl) => {
//   const defaultPlaceholder = 'Uploads/placeholder.jpg';
//   if (!imageUrl) return defaultPlaceholder;
//   const normalized = imageUrl
//     .replace(/^http:\/\/localhost:5000/, '')
//     .replace(/^\/?[Uu]ploads\//, 'Uploads/');
//   return normalized.startsWith('Uploads/') ? normalized : defaultPlaceholder;
// };

// // Email Template for Delivery Confirmation
// const generateDeliveryEmailContent = (order) => {
//   const productNames = order.items.map((item) => item.name).join(', ');
//   const defaultPlaceholder = 'Uploads/placeholder.jpg';
//   const API_BASE = process.env.API_BASE || 'http://localhost:5000';
//   const feedbackUrl = `${API_BASE}/review/${order._id}`;

//   const itemsHtml = order.items
//     .map((item, index) => {
//       let imageUrl = normalizeImageUrl(item.imageUrl);
//       const imagePath = path.join(__dirname, '..', 'public', imageUrl);
//       let finalImageUrl = imageUrl;

//       if (!fs.existsSync(imagePath)) {
//         console.warn(`Image file not found for ${item.name}: ${imagePath}, using default placeholder`);
//         finalImageUrl = defaultPlaceholder;
//       }

//       const cid = `image-${index}@ecommerce`;
//       const fallbackUrl = `${API_BASE}/${finalImageUrl.replace(/\\/g, '/')}`;

//       return `
//         <tr>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">
//             <img src="cid:${cid}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.src='${fallbackUrl}'" />
//           </td>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">${(item.quantity * item.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//       `;
//     })
//     .join('');

//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//       <h2 style="color: #28a745; text-align: center;">Order Delivered!</h2>
//       <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
//       <p style="color: #555; text-align: center;">Your order #${order._id} for ${productNames} has been successfully delivered!</p>

//       <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
//       <table style="width: 100%; border-collapse: collapse;">
//         <thead>
//           <tr style="background-color: #f1faff; color: #333;">
//             <th style="padding: 10px; text-align: left;">Image</th>
//             <th style="padding: 10px; text-align: left;">Item</th>
//             <th style="padding: 10px; text-align: left;">Quantity</th>
//             <th style="padding: 10px; text-align: left;">Price</th>
//             <th style="padding: 10px; text-align: left;">Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${itemsHtml}
//         </tbody>
//       </table>

//       <h3 style="color: #333; margin-top: 20px;">Order Totals</h3>
//       <table style="width: 100%; color: #555;">
//         <tr>
//           <td style="padding: 5px;">Subtotal</td>
//           <td style="padding: 5px; text-align: right;">${order.totals.subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px;">GST (18%)</td>
//           <td style="padding: 5px; text-align: right;">${order.totals.gstAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         ${
//           order.totals.promoDiscount > 0
//             ? `
//               <tr style="color: #28a745;">
//                 <td style="padding: 5px;">Promo Discount</td>
//                 <td style="padding: 5px; text-align: right;">-${order.totals.promoDiscount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//               </tr>
//             `
//             : ''
//         }
//         ${
//           order.totals.walletAmountUsed > 0
//             ? `
//               <tr style="color: #28a745;">
//                 <td style="padding: 5px;">Wallet Payment</td>
//                 <td style="padding: 5px; text-align: right;">-${order.totals.walletAmountUsed.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//               </tr>
//             `
//             : ''
//         }
//         <tr>
//           <td style="padding: 5px;">Total (Before Payments)</td>
//           <td style="padding: 5px; text-align: right;">${order.totals.baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr style="font-weight: bold; color: #333;">
//           <td style="padding: 5px;">Final Payment</td>
//           <td style="padding: 5px; text-align: right;">${order.totals.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px;">Shipping</td>
//           <td style="padding: 5px; text-align: right;">FREE</td>
//         </tr>
//       </table>

//       <h3 style="color: #333; margin-top: 20px;">Shipping Information</h3>
//       <p style="color: #555;">
//         <strong>Name:</strong> ${order.shipping.name || 'N/A'}<br />
//         <strong>Address:</strong> ${order.shipping.address || 'N/A'}, ${order.shipping.city || 'N/A'}, ${order.shipping.postalCode || 'N/A'}<br />
//         <strong>Phone:</strong> ${order.shipping.phone || 'N/A'}<br />
//         <strong>Email:</strong> ${order.shipping.email || 'N/A'}
//       </p>

//       <h3 style="color: #333; margin-top: 20px;">We Value Your Feedback!</h3>
//       <p style="color: #555; text-align: center;">
//         Please share your experience by rating and reviewing the products you received. Your feedback helps us improve!
//       </p>
//       <p style="text-align: center;">
//         <a href="${feedbackUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Rate & Review Products</a>
//       </p>

//       <p style="color: #555; text-align: center; margin-top: 20px;">
//         If you have any issues, contact us at support@example.com.
//       </p>
//       <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
//     </div>
//   `;

//   const attachments = order.items
//     .map((item, index) => {
//       let imageUrl = normalizeImageUrl(item.imageUrl);
//       let imagePath = path.join(__dirname, '..', 'public', imageUrl);

//       if (!fs.existsSync(imagePath)) {
//         console.warn(`Image file not found for ${item.name}: ${imagePath}, using default placeholder`);
//         imageUrl = defaultPlaceholder;
//         imagePath = path.join(__dirname, '..', 'public', imageUrl);
//       }

//       if (!fs.existsSync(imagePath)) {
//         console.error(`Skipping attachment for ${item.name}: ${imagePath} does not exist`);
//         return null;
//       }

//       console.log(`Attaching image for ${item.name}:`, { imageUrl, imagePath, exists: fs.existsSync(imagePath) });

//       return {
//         filename: path.basename(imageUrl),
//         path: imagePath,
//         cid: `image-${index}@ecommerce`,
//       };
//     })
//     .filter((attachment) => attachment !== null);

//   return { html: htmlContent, attachments };
// };

// // Update order status to Delivered and send email
// const updateToDelivered = async (orderId) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     console.log(`Processing delivery for order: ${orderId}`);

//     // Fetch order
//     const order = await Order.findById(orderId).session(session);
//     if (!order) {
//       console.error(`Order not found: ${orderId}`);
//       await session.abortTransaction();
//       session.endSession();
//       throw new Error('Order not found');
//     }

//     // Check if already Delivered
//     if (order.status === 'Delivered') {
//       console.warn(`Order ${orderId} already delivered`);
//       await session.commitTransaction();
//       session.endSession();
//       return { success: false, message: 'Order already delivered' };
//     }

//     // Validate status
//     if (order.status !== 'Shipped') {
//       console.error(`Order ${orderId} not in Shipped status: ${order.status}`);
//       await session.abortTransaction();
//       session.endSession();
//       throw new Error('Order must be in Shipped status to be marked Delivered');
//     }

//     // Validate email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(order.shipping.email)) {
//       console.error(`Invalid email address for order ${orderId}: ${order.shipping.email}`);
//       await session.abortTransaction();
//       session.endSession();
//       throw new Error('Invalid email address');
//     }

//     // Update order status
//     order.status = 'Delivered';
//     order.deliveredAt = new Date();
//     await order.save({ session });
//     console.log(`Order ${orderId} updated to Delivered at: ${order.deliveredAt}`);

//     // Generate and send delivery email
//     const { html, attachments } = generateDeliveryEmailContent(order);
//     const mailOptions = {
//       from: `"Your Store" <${process.env.EMAIL_USER}>`,
//       to: order.shipping.email,
//       subject: `Order #${order._id} Delivered`,
//       html,
//       attachments,
//     };

//     console.log('Delivery email options:', {
//       to: mailOptions.to,
//       from: mailOptions.from,
//       subject: mailOptions.subject,
//       attachments: attachments.map((a) => ({ filename: a.filename, path: a.path, cid: a.cid })),
//     });

//     await transporter.sendMail(mailOptions);
//     console.log(`Delivery confirmation email sent to: ${order.shipping.email}`);

//     // Create delivery notification
//     const productNames = order.items.map((item) => item.name).join(', ');
//     const notification = new Notification({
//       userId: order.shipping.userId,
//       message: `Order #${order._id} for ${productNames} has been delivered`,
//       imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
//       totalPrice: order.totals.baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
//       isRead: false,
//     });
//     await notification.save({ session });
//     console.log('Delivery notification created:', {
//       userId: order.shipping.userId,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       totalPrice: notification.totalPrice,
//     });

//     await session.commitTransaction();
//     session.endSession();

//     return { success: true, message: `Order ${orderId} marked as Delivered and email sent` };
//   } catch (err) {
//     console.error(`Error updating order ${orderId} to Delivered:`, err.message, err.stack);
//     await session.abortTransaction();
//     session.endSession();
//     throw err;
//   }
// };

// module.exports = { updateToDelivered };





// const mongoose = require('mongoose');
// const nodemailer = require('nodemailer');
// const Order = require('../models/Order');
// const Notification = require('../models/Notification');
// const path = require('path');
// const fs = require('fs');

// // Nodemailer Transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Normalize image URL for backend
// const normalizeImageUrl = (imageUrl) => {
//   const defaultPlaceholder = 'Uploads/placeholder.jpg';
//   if (!imageUrl) return defaultPlaceholder;
//   const normalized = imageUrl
//     .replace(/^http:\/\/localhost:5000/, '')
//     .replace(/^\/?[Uu]ploads\//, 'Uploads/');
//   return normalized.startsWith('Uploads/') ? normalized : defaultPlaceholder;
// };

// // Email Template for Delivery Confirmation
// const generateDeliveryEmailContent = (order) => {
//   const productNames = order.items.map((item) => item.name).join(', ');
//   const defaultPlaceholder = 'Uploads/placeholder.jpg';
//   const API_BASE = process.env.API_BASE || 'http://localhost:5000';
//   const feedbackUrl = `${API_BASE}/review/${order._id}`;

//   const itemsHtml = order.items
//     .map((item, index) => {
//       let imageUrl = normalizeImageUrl(item.imageUrl);
//       const imagePath = path.join(__dirname, '..', 'public', imageUrl);
//       let finalImageUrl = imageUrl;

//       if (!fs.existsSync(imagePath)) {
//         console.warn(`Image file not found for ${item.name}: ${imagePath}, using default placeholder`);
//         finalImageUrl = defaultPlaceholder;
//       }

//       const cid = `image-${index}@ecommerce`;
//       const fallbackUrl = `${API_BASE}/${finalImageUrl.replace(/\\/g, '/')}`;

//       return `
//         <tr>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">
//             <img src="cid:${cid}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.src='${fallbackUrl}'" />
//           </td>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">${(item.quantity * item.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//       `;
//     })
//     .join('');

//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//       <h2 style="color: #28a745; text-align: center;">Order Delivered!</h2>
//       <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
//       <p style="color: #555; text-align: center;">Your order #${order._id} for ${productNames} has been successfully delivered!</p>

//       <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
//       <table style="width: 100%; border-collapse: collapse;">
//         <thead>
//           <tr style="background-color: #f1faff; color: #333;">
//             <th style="padding: 10px; text-align: left;">Image</th>
//             <th style="padding: 10px; text-align: left;">Item</th>
//             <th style="padding: 10px; text-align: left;">Quantity</th>
//             <th style="padding: 10px; text-align: left;">Price</th>
//             <th style="padding: 10px; text-align: left;">Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${itemsHtml}
//         </tbody>
//       </table>

//       <h3 style="color: #333; margin-top: 20px;">Order Totals</h3>
//       <table style="width: 100%; color: #555;">
//         <tr>
//           <td style="padding: 5px;">Subtotal</td>
//           <td style="padding: 5px; text-align: right;">${order.totals.subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px;">GST (18%)</td>
//           <td style="padding: 5px; text-align: right;">${order.totals.gstAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         ${
//           order.totals.promoDiscount > 0
//             ? `
//               <tr style="color: #28a745;">
//                 <td style="padding: 5px;">Promo Discount</td>
//                 <td style="padding: 5px; text-align: right;">-${order.totals.promoDiscount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//               </tr>
//             `
//             : ''
//         }
//         ${
//           order.totals.walletAmountUsed > 0
//             ? `
//               <tr style="color: #28a745;">
//                 <td style="padding: 5px;">Wallet Payment</td>
//                 <td style="padding: 5px; text-align: right;">-${order.totals.walletAmountUsed.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//               </tr>
//             `
//             : ''
//         }
//         <tr>
//           <td style="padding: 5px;">Total (Before Payments)</td>
//           <td style="padding: 5px; text-align: right;">${order.totals.baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr style="font-weight: bold; color: #333;">
//           <td style="padding: 5px;">Final Payment</td>
//           <td style="padding: 5px; text-align: right;">${order.totals.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px;">Shipping</td>
//           <td style="padding: 5px; text-align: right;">FREE</td>
//         </tr>
//       </table>

//       <h3 style="color: #333; margin-top: 20px;">Shipping Information</h3>
//       <p style="color: #555;">
//         <strong>Name:</strong> ${order.shipping.name || 'N/A'}<br />
//         <strong>Address:</strong> ${order.shipping.address || 'N/A'}, ${order.shipping.city || 'N/A'}, ${order.shipping.postalCode || 'N/A'}<br />
//         <strong>Phone:</strong> ${order.shipping.phone || 'N/A'}<br />
//         <strong>Email:</strong> ${order.shipping.email || 'N/A'}
//       </p>

//       <h3 style="color: #333; margin-top: 20px;">We Value Your Feedback!</h3>
//       <p style="color: #555; text-align: center;">
//         Please share your experience by rating and reviewing the products you received. Your feedback helps us improve!
//       </p>
//       <p style="text-align: center;">
//         <a href="${feedbackUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Rate & Review Products</a>
//       </p>

//       <p style="color: #555; text-align: center; margin-top: 20px;">
//         If you have any issues, contact us at support@example.com.
//       </p>
//       <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
//     </div>
//   `;

//   const attachments = order.items
//     .map((item, index) => {
//       let imageUrl = normalizeImageUrl(item.imageUrl);
//       let imagePath = path.join(__dirname, '..', 'public', imageUrl);

//       if (!fs.existsSync(imagePath)) {
//         console.warn(`Image file not found for ${item.name}: ${imagePath}, using default placeholder`);
//         imageUrl = defaultPlaceholder;
//         imagePath = path.join(__dirname, '..', 'public', imageUrl);
//       }

//       if (!fs.existsSync(imagePath)) {
//         console.error(`Skipping attachment for ${item.name}: ${imagePath} does not exist`);
//         return null;
//       }

//       console.log(`Attaching image for ${item.name}:`, { imageUrl, imagePath, exists: fs.existsSync(imagePath) });

//       return {
//         filename: path.basename(imageUrl),
//         path: imagePath,
//         cid: `image-${index}@ecommerce`,
//       };
//     })
//     .filter((attachment) => attachment !== null);

//   return { html: htmlContent, attachments };
// };

// // Update order status to Delivered and send email
// const updateToDelivered = async (orderId) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     console.log(`Processing delivery for order: ${orderId}`);

//     // Fetch order
//     const order = await Order.findById(orderId).session(session);
//     if (!order) {
//       console.error(`Order not found: ${orderId}`);
//       await session.abortTransaction();
//       session.endSession();
//       throw new Error('Order not found');
//     }

//     // Check if already Delivered
//     if (order.status === 'Delivered') {
//       console.warn(`Order ${orderId} already delivered`);
//       await session.commitTransaction();
//       session.endSession();
//       return { success: false, message: 'Order already delivered' };
//     }

//     // Validate status
//     if (order.status !== 'Shipped') {
//       console.error(`Order ${orderId} not in Shipped status: ${order.status}`);
//       await session.abortTransaction();
//       session.endSession();
//       throw new Error('Order must be in Shipped status to be marked Delivered');
//     }

//     // Validate email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(order.shipping.email)) {
//       console.error(`Invalid email address for order ${orderId}: ${order.shipping.email}`);
//       await session.abortTransaction();
//       session.endSession();
//       throw new Error('Invalid email address');
//     }

//     // Update order status
//     order.status = 'Delivered';
//     order.deliveredAt = new Date();
//     await order.save({ session });
//     console.log(`Order ${orderId} updated to Delivered at: ${order.deliveredAt}`);

//     // Generate and send delivery email
//     const { html, attachments } = generateDeliveryEmailContent(order);
//     const mailOptions = {
//       from: `"Your Store" <${process.env.EMAIL_USER}>`,
//       to: order.shipping.email,
//       subject: `Order #${order._id} Delivered`,
//       html,
//       attachments,
//     };

//     console.log('Delivery email options:', {
//       to: mailOptions.to,
//       from: mailOptions.from,
//       subject: mailOptions.subject,
//       attachments: attachments.map((a) => ({ filename: a.filename, path: a.path, cid: a.cid })),
//     });

//     await transporter.sendMail(mailOptions);
//     console.log(`Delivery confirmation email sent to: ${order.shipping.email}`);

//     // Create delivery notification
//     const productNames = order.items.map((item) => item.name).join(', ');
//     const notification = new Notification({
//       userId: order.shipping.userId,
//       message: `Order #${order._id} for ${productNames} has been delivered`,
//       imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
//       totalPrice: order.totals.baseTotal, // Store as number
//       isRead: false,
//     });
//     await notification.save({ session });
//     console.log('Delivery notification created:', {
//       userId: order.shipping.userId,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       totalPrice: notification.totalPrice,
//     });

//     await session.commitTransaction();
//     session.endSession();

//     return { success: true, message: `Order ${orderId} marked as Delivered and email sent` };
//   } catch (err) {
//     console.error(`Error updating order ${orderId} to Delivered:`, err.message, err.stack);
//     await session.abortTransaction();
//     session.endSession();
//     throw err;
//   }
// };

// module.exports = { updateToDelivered };