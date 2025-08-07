













// const express = require('express');
// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;
// const Order = require('../models/Order');
// const Notification = require('../models/Notification');
// const Wallet = require('../models/Wallet');
// const Product = require('../models/Product');
// const Transaction = require('../models/Transaction');
// const fs = require('fs');
// const path = require('path');
// const jwt = require('jsonwebtoken');

// const router = express.Router();

// // Nodemailer Transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Middleware to verify JWT token
// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split('Bearer ')[1];
//   if (!token) {
//     console.error('No token provided in request');
//     return res.status(401).json({ error: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded token:', decoded);
//     req.user = decoded; // { id, email, name, role }
//     next();
//   } catch (err) {
//     console.error('Token verification error:', err.message);
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };

// // Normalize image URL for backend
// const normalizeImageUrl = (imageUrl) => {
//   const defaultPlaceholder = 'Uploads/placeholder.jpg';
//   if (!imageUrl) return defaultPlaceholder;
//   const normalized = imageUrl
//     .replace(/^http:\/\/localhost:5000/, '')
//     .replace(/^\/?[Uu]ploads\//, 'Uploads/');
//   return normalized.startsWith('Uploads/') ? normalized : defaultPlaceholder;
// };

// // Email Template for Order Confirmation
// const generateOrderEmailContent = (orderData) => {
//   const { items, formData, subtotal, gstAmount, promoApplied, validPromoDiscount, walletAmountUsed, baseTotal, totalAmount, promoCodes } = orderData;
//   const productNames = items.map((i) => i.name).join(', ');
//   const defaultPlaceholder = 'Uploads/placeholder.jpg';
//   const API_BASE = process.env.API_BASE || 'http://localhost:5000';

//   const itemsHtml = items
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

//       console.log(`Processing image for ${item.name}:`, {
//         imageUrl,
//         imagePath,
//         exists: fs.existsSync(imagePath),
//         finalImageUrl,
//         fallbackUrl,
//         cid,
//       });

//       return `
//         <tr>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">
//             <img src="cid:${cid}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.src='${fallbackUrl}'" />
//           </td>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price.toFixed(2)}</td>
//           <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${(item.quantity * item.price).toFixed(2)}</td>
//         </tr>
//       `;
//     })
//     .join('');

//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//       <h2 style="color: #28a745; text-align: center;">Order Confirmation</h2>
//       <p style="color: #333; text-align: center;">Thank you for your purchase, ${formData.name || 'Customer'}!</p>
//       <p style="color: #555; text-align: center;">Your order for ${productNames} has been successfully placed.</p>

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
//           <td style="padding: 5px; text-align: right;">₹${subtotal.toFixed(2)}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px;">GST (18%)</td>
//           <td style="padding: 5px; text-align: right;">₹${gstAmount.toFixed(2)}</td>
//         </tr>
//         ${
//           promoApplied
//             ? `
//               <tr style="color: #28a745;">
//                 <td style="padding: 5px;">Promo Discount (${promoCodes[promoApplied].label})</td>
//                 <td style="padding: 5px; text-align: right;">-₹${validPromoDiscount.toFixed(2)}</td>
//               </tr>
//             `
//             : ''
//         }
//         ${
//           walletAmountUsed > 0
//             ? `
//               <tr style="color: #28a745;">
//                 <td style="padding: 5px;">Wallet Payment</td>
//                 <td style="padding: 5px; text-align: right;">-₹${walletAmountUsed.toFixed(2)}</td>
//               </tr>
//             `
//             : ''
//         }
//         <tr>
//           <td style="padding: 5px;">Total (Before Payments)</td>
//           <td style="padding: 5px; text-align: right;">₹${baseTotal.toFixed(2)}</td>
//         </tr>
//         <tr style="font-weight: bold; color: #333;">
//           <td style="padding: 5px;">${formData.paymentMethod} Payment</td>
//           <td style="padding: 5px; text-align: right;">₹${totalAmount.toFixed(2)}</td>
//         </tr>
//       </table>

//       <h3 style="color: #333; margin-top: 20px;">Shipping Information</h3>
//       <p style="color: #555;">
//         <strong>Name:</strong> ${formData.name || 'N/A'}<br />
//         <strong>Address:</strong> ${formData.address || 'N/A'}, ${formData.city || 'N/A'}, ${formData.postalCode || 'N/A'}<br />
//         <strong>Phone:</strong> ${formData.phone || 'N/A'}<br />
//         <strong>Email:</strong> ${formData.email || 'N/A'}
//       </p>

//       <h3 style="color: #333; margin-top: 20px;">Payment Method</h3>
//       <p style="color: #555;"><strong>Method:</strong> ${formData.paymentMethod}${formData.upiProvider ? ` (${formData.upiProvider})` : ''}${walletAmountUsed > 0 ? ' + Wallet' : ''}</p>

//       <p style="color: #555; text-align: center; margin-top: 20px;">
//         We'll notify you when your order ships. Contact us at support@example.com.
//       </p>
//       <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
//     </div>
//   `;

//   return { html: htmlContent, items };
// };

// // Email Template for Cancellation Confirmation
// const generateCancelEmailContent = (order, refundAmount, gstDeduction) => {
//   const productNames = order.items.map((item) => item.name).join(', ');
//   const netRefunded = refundAmount - gstDeduction;
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//       <h2 style="color: #dc2626; text-align: center;">Order Cancellation Confirmation</h2>
//       <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
//       <p style="color: #555; text-align: center;">Your order #${order._id} for ${productNames} has been cancelled.</p>

//       <h3 style="color: #333; margin-top: 20px;">Refund Details</h3>
//       <table style="width: 100%; color: #555;">
//         <tr>
//           <td style="padding: 5px;">Order Total</td>
//           <td style="padding: 5px; text-align: right;">₹${order.totals.baseTotal.toFixed(2)}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px;">GST Deduction (18%)</td>
//           <td style="padding: 5px; text-align: right;">-₹${gstDeduction.toFixed(2)}</td>
//         </tr>
//         <tr style="font-weight: bold; color: #333;">
//           <td style="padding: 5px;">Refunded to Wallet</td>
//           <td style="padding: 5px; text-align: right;">₹${netRefunded.toFixed(2)}</td>
//         </tr>
//       </table>

//       <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
//       <p style="color: #555;">Items: ${productNames}</p>
//       <p style="color: #555;">Status: Cancelled</p>

//       <p style="color: #555; text-align: center; margin-top: 20px;">
//         The refund of ₹${netRefunded.toFixed(2)} has been credited to your wallet after deducting the GST fee. Contact us at support@example.com for any queries.
//       </p>
//       <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
//     </div>
//   `;

//   return htmlContent;
// };

// // Email Template for Return Request Confirmation
// const generateReturnEmailContent = (order, returnReason, returnDetails) => {
//   const productNames = order.items.map((item) => item.name).join(', ');
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//       <h2 style="color: #ff9800; text-align: center;">Return Request Confirmation</h2>
//       <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
//       <p style="color: #555; text-align: center;">Your return request for order #${order._id} for ${productNames} has been received.</p>

//       <h3 style="color: #333; margin-top: 20px;">Return Details</h3>
//       <p style="color: #555;">
//         <strong>Reason:</strong> ${returnReason}<br />
//         <strong>Additional Details:</strong> ${returnDetails || 'None provided'}
//       </p>

//       <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
//       <p style="color: #555;">Items: ${productNames}</p>
//       <p style="color: #555;">Status: Return Requested</p>

//       <p style="color: #555; text-align: center; margin-top: 20px;">
//         Please return the items within 7 days to our warehouse at: 123 Commerce Street, City, Country, ZIP 12345. Your refund will be processed after we receive and verify the returned items. Contact us at support@example.com for return instructions or queries.
//       </p>
//       <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
//     </div>
//   `;

//   return htmlContent;
// };

// // Email Template for Return Refund Confirmation
// const generateReturnRefundEmailContent = (order, refundAmount, gstDeduction) => {
//   const productNames = order.items.map((item) => item.name).join(', ');
//   const netRefunded = refundAmount - gstDeduction;
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//       <h2 style="color: #28a745; text-align: center;">Return and Refund Confirmation</h2>
//       <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
//       <p style="color: #555; text-align: center;">Your return for order #${order._id} for ${productNames} has been received and processed.</p>

//       <h3 style="color: #333; margin-top: 20px;">Refund Details</h3>
//       <table style="width: 100%; color: #555;">
//         <tr>
//           <td style="padding: 5px;">Order Total</td>
//           <td style="padding: 5px; text-align: right;">₹${order.totals.baseTotal.toFixed(2)}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px;">GST Deduction (18%)</td>
//           <td style="padding: 5px; text-align: right;">-₹${gstDeduction.toFixed(2)}</td>
//         </tr>
//         <tr style="font-weight: bold; color: #333;">
//           <td style="padding: 5px;">Refunded to Wallet</td>
//           <td style="padding: 5px; text-align: right;">₹${netRefunded.toFixed(2)}</td>
//         </tr>
//       </table>

//       <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
//       <p style="color: #555;">Items: ${productNames}</p>
//       <p style="color: #555;">Status: Returned</p>

//       <p style="color: #555; text-align: center; margin-top: 20px;">
//         The refund of ₹${netRefunded.toFixed(2)} has been credited to your wallet after deducting the GST fee. Contact us at support@example.com for any queries.
//       </p>
//       <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
//     </div>
//   `;

//   return htmlContent;
// };

// // Email Template for Delivered Refund Confirmation
// const generateDeliveredRefundEmailContent = (order, refundAmount, gstDeduction) => {
//   const productNames = order.items.map((item) => item.name).join(', ');
//   const netRefunded = refundAmount - gstDeduction;
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//       <h2 style="color: #28a745; text-align: center;">Order Delivered and Refund Confirmation</h2>
//       <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
//       <p style="color: #555; text-align: center;">Your order #${order._id} for ${productNames} has been marked as delivered and refunded.</p>

//       <h3 style="color: #333; margin-top: 20px;">Refund Details</h3>
//       <table style="width: 100%; color: #555;">
//         <tr>
//           <td style="padding: 5px;">Order Total</td>
//           <td style="padding: 5px; text-align: right;">₹${order.totals.baseTotal.toFixed(2)}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px;">GST Deduction (18%)</td>
//           <td style="padding: 5px; text-align: right;">-₹${gstDeduction.toFixed(2)}</td>
//         </tr>
//         <tr style="font-weight: bold; color: #333;">
//           <td style="padding: 5px;">Refunded to Wallet</td>
//           <td style="padding: 5px; text-align: right;">₹${netRefunded.toFixed(2)}</td>
//         </tr>
//       </table>

//       <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
//       <p style="color: #555;">Items: ${productNames}</p>
//       <p style="color: #555;">Status: Delivered and Refunded</p>

//       <p style="color: #555; text-align: center; margin-top: 20px;">
//         The refund of ₹${netRefunded.toFixed(2)} has been credited to your wallet after deducting the GST fee. Contact us at support@example.com for any queries.
//       </p>
//       <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
//     </div>
//   `;

//   return htmlContent;
// };

// // POST /api/orders/send-confirmation
// router.post('/send-confirmation', authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const {
//       items,
//       formData,
//       subtotal,
//       gstAmount,
//       promoApplied,
//       validPromoDiscount,
//       walletAmountUsed,
//       baseTotal,
//       totalAmount,
//       promoCodes,
//     } = req.body;

//     // Validate required fields
//     const missingFields = [];
//     if (!items || !items.length) missingFields.push('items');
//     if (!formData) missingFields.push('formData');
//     else {
//       if (!formData.email) missingFields.push('formData.email');
//       if (!formData.name) missingFields.push('formData.name');
//       if (!formData.phone) missingFields.push('formData.phone');
//       if (!formData.address) missingFields.push('formData.address');
//       if (!formData.city) missingFields.push('formData.city');
//       if (!formData.postalCode) missingFields.push('formData.postalCode');
//       if (!formData.paymentMethod) missingFields.push('formData.paymentMethod');
//     }
//     if (subtotal === undefined || subtotal < 0) missingFields.push('subtotal');
//     if (gstAmount === undefined || gstAmount < 0) missingFields.push('gstAmount');
//     if (baseTotal === undefined || baseTotal < 0) missingFields.push('baseTotal');
//     if (totalAmount === undefined || totalAmount < 0) missingFields.push('totalAmount');

//     if (missingFields.length > 0) {
//       console.error('Invalid order data:', {
//         missingFields,
//         itemsCount: items?.length,
//         formData: formData || 'undefined',
//         subtotal,
//         gstAmount,
//         baseTotal,
//         totalAmount,
//         walletAmountUsed,
//       });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: `Missing required order data: ${missingFields.join(', ')}` });
//     }

//     // Verify email matches authenticated user
//     if (formData.email !== req.user.email) {
//       console.warn('Email mismatch:', formData.email, 'vs', req.user.email);
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ error: 'Email does not match authenticated user' });
//     }

//     // Validate items have _id, name, price, quantity, and valid ObjectId
//     const invalidItems = items.filter(
//       (item) => !item._id || !ObjectId.isValid(item._id) || !item.name || !item.price || !item.quantity
//     );
//     if (invalidItems.length > 0) {
//       console.error('Invalid items:', invalidItems.map((i) => ({
//         _id: i._id,
//         name: i.name,
//         price: i.price,
//         quantity: i.quantity,
//         isValidObjectId: i._id ? ObjectId.isValid(i._id) : false,
//       })));
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'All items must have a valid ObjectId _id, name, price, and quantity' });
//     }

//     // Log incoming items for debugging
//     console.log('Received items:', items.map((item) => ({
//       _id: item._id,
//       name: item.name,
//       imageUrl: item.imageUrl,
//       quantity: item.quantity,
//     })));

//     // Validate and update stock
//     const productIds = items.map((item) => new ObjectId(item._id));
//     const products = await Product.find({ _id: { $in: productIds } }).session(session);

//     for (const item of items) {
//       const product = products.find((p) => p._id.toString() === item._id);
//       if (!product) {
//         console.error(`Product not found for ID: ${item._id}, Name: ${item.name}`);
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(404).json({ error: `Product not found: ${item.name} (ID: ${item._id})` });
//       }
//       if (product.stock < item.quantity) {
//         console.error(`Insufficient stock for ${item.name}:`, { available: product.stock, requested: item.quantity });
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: `Insufficient stock for ${item.name}: only ${product.stock} available` });
//       }
//       product.stock -= item.quantity;
//       await product.save({ session });
//       console.log(`Updated stock for ${product.name}:`, { newStock: product.stock });
//     }

//     // Handle wallet payment
//     if (walletAmountUsed > 0) {
//       const wallet = await Wallet.findOne({ userId: req.user.id }).session(session);
//       if (!wallet) {
//         console.error('Wallet not found for user:', req.user.id);
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: 'Wallet not found' });
//       }
//       if (wallet.balance < walletAmountUsed) {
//         console.error('Insufficient wallet balance:', { balance: wallet.balance, requested: walletAmountUsed });
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: `Insufficient wallet balance: ${wallet.balance} < ${walletAmountUsed}` });
//       }

//       // Deduct wallet balance
//       wallet.balance -= walletAmountUsed;
//       wallet.transactions.push({
//         type: 'debit',
//         amount: walletAmountUsed,
//         description: `Order payment for ${items.map((i) => i.name).join(', ')}`,
//         createdAt: new Date(),
//       });
//       await wallet.save({ session });
//       console.log('Wallet updated:', { userId: req.user.id, newBalance: wallet.balance });

//       // Log transaction
//       await Transaction.create(
//         [{
//           userId: req.user.id,
//           orderId: null, // Order ID not yet available
//           type: 'debit',
//           amount: walletAmountUsed,
//           description: `Wallet payment for order`,
//           createdAt: new Date(),
//         }],
//         { session }
//       );
//     }

//     // Save order to MongoDB
//     const order = new Order({
//       userId: req.user.id,
//       items: items.map((item) => ({
//         _id: new ObjectId(item._id),
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         imageUrl: normalizeImageUrl(item.imageUrl),
//       })),
//       shipping: {
//         name: formData.name,
//         phone: formData.phone,
//         email: formData.email,
//         address: formData.address,
//         city: formData.city,
//         postalCode: formData.postalCode,
//         userId: req.user.id,
//       },
//       payment: {
//         method: formData.paymentMethod,
//         upiId: formData.upiId || '',
//         cardLastFour: formData.cardNumber ? formData.cardNumber.slice(-4) : '',
//         upiProvider: formData.upiProvider || '',
//       },
//       totals: {
//         subtotal,
//         gstAmount,
//         promoDiscount: validPromoDiscount || 0,
//         walletAmountUsed: walletAmountUsed || 0,
//         baseTotal,
//         totalAmount,
//         promoCode: promoApplied || '',
//       },
//       deliveredAt: null, // Initialize deliveredAt
//     });

//     const savedOrder = await order.save({ session });
//     console.log('Order saved:', { id: savedOrder._id, email: savedOrder.shipping.email, userId: savedOrder.shipping.userId });

//     // Update transaction with order ID
//     if (walletAmountUsed > 0) {
//       await Transaction.updateMany(
//         { userId: req.user.id, orderId: null, type: 'debit', amount: walletAmountUsed },
//         { orderId: savedOrder._id },
//         { session }
//       );
//     }

//     // Create notification with image and total price
//     const productNames = items.map((item) => item.name).join(', ');
//     const notification = new Notification({
//       userId: req.user.id,
//       message: `Order placed successfully for: ${productNames}`,
//       imageUrl: normalizeImageUrl(items[0]?.imageUrl),
//       totalPrice: baseTotal,
//       isRead: false,
//     });
//     await notification.save({ session });
//     console.log('Notification created:', {
//       userId: req.user.id,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       totalPrice: notification.totalPrice,
//     });

//     // Prepare email attachments
//     const { html, items: emailItems } = generateOrderEmailContent(req.body);
//     const defaultPlaceholder = 'Uploads/placeholder.jpg';
//     const defaultPlaceholderPath = path.join(__dirname, '..', 'public', defaultPlaceholder);

//     // Log if default placeholder is missing
//     if (!fs.existsSync(defaultPlaceholderPath)) {
//       console.warn(`Default placeholder not found: ${defaultPlaceholderPath}`);
//     }

//     const attachments = emailItems
//       .map((item, index) => {
//         let imageUrl = normalizeImageUrl(item.imageUrl);
//         let imagePath = path.join(__dirname, '..', 'public', imageUrl);

//         if (!fs.existsSync(imagePath)) {
//           console.warn(`Image file not found for ${item.name}: ${imagePath}, using default placeholder`);
//           imagePath = defaultPlaceholderPath;
//           imageUrl = defaultPlaceholder;
//         }

//         if (!fs.existsSync(imagePath)) {
//           console.error(`Skipping attachment for ${item.name}: ${imagePath} does not exist`);
//           return null;
//         }

//         console.log(`Attaching image for ${item.name}:`, { imageUrl, imagePath, exists: fs.existsSync(imagePath) });

//         return {
//           filename: path.basename(imageUrl),
//           path: imagePath,
//           cid: `image-${index}@ecommerce`,
//         };
//       })
//       .filter((attachment) => attachment !== null);

//     console.log('Email attachments:', attachments.map((a) => ({ filename: a.filename, path: a.path, cid: a.cid })));

//     // Send confirmation email
//     const mailOptions = {
//       from: `"Your Store" <${process.env.EMAIL_USER}>`,
//       to: formData.email,
//       subject: `Order Confirmation #${savedOrder._id}`,
//       html,
//       attachments,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Confirmation email sent to:', formData.email);

//     // Commit transaction
//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       productNames,
//       orderId: savedOrder._id,
//       message: 'Order processed, notification created, and email sent',
//     });
//   } catch (error) {
//     console.error('Error processing order:', error.message, error.stack);
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ error: error.message || 'Failed to process order' });
//   }
// });

// // Get all orders (admins get all, users get their own)
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     console.log('Fetching orders for:', { email: req.user.email, userId: req.user.id, role: req.user.role });
//     let orders;
//     if (req.user.role === 'admin') {
//       orders = await Order.find({});
//     } else {
//       orders = await Order.find({
//         $or: [{ 'shipping.email': req.user.email }, { 'shipping.userId': req.user.id }],
//       });
//     }
//     console.log('Fetched orders:', orders.length, 'for user:', req.user.email);
//     res.json(orders);
//   } catch (err) {
//     console.error('Error fetching orders:', err.message);
//     res.status(500).json({ error: 'Failed to fetch orders' });
//   }
// });

// // Get single order by ID
// router.get('/:id', authMiddleware, async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ error: 'Order not found' });
//     if (
//       req.user.role !== 'admin' &&
//       order.shipping.email !== req.user.email &&
//       String(order.shipping.userId) !== req.user.id
//     ) {
//       console.warn('Unauthorized access:', {
//         orderEmail: order.shipping.email,
//         orderUserId: order.shipping.userId,
//         user: req.user,
//       });
//       return res.status(403).json({ error: 'Unauthorized access to order' });
//     }
//     res.json(order);
//   } catch (err) {
//     console.error('Error fetching order:', err.message);
//     res.status(500).json({ error: 'Failed to fetch order' });
//   }
// });

// // Update order status (e.g., to Delivered)
// router.patch('/:id/status', authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { status } = req.body;
//     console.log('Status update request:', { orderId: req.params.id, status, user: req.user });

//     // Validate status
//     if (!['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'].includes(status)) {
//       console.error('Invalid status provided:', status);
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Invalid status' });
//     }

//     // Fetch order
//     const order = await Order.findById(req.params.id).session(session);
//     if (!order) {
//       console.error('Order not found:', req.params.id);
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ error: 'Order not found' });
//     }
//     console.log('Order found:', { orderId: order._id, currentStatus: order.status, email: order.shipping.email });

//     // Check admin permissions
//     if (req.user.role !== 'admin') {
//       console.warn('Unauthorized status update:', {
//         orderEmail: order.shipping.email,
//         orderUserId: order.shipping.userId,
//         user: req.user,
//       });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ error: 'Only admins can update order status' });
//     }

//     // Prevent status change for cancelled or returned orders
//     if (order.status === 'Cancelled' || order.status === 'Returned') {
//       console.error('Cannot change status:', { orderId: order._id, currentStatus: order.status, attemptedStatus: status });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: `Cannot change status of ${order.status.toLowerCase()} order` });
//     }

//     // Update order status
//     order.status = status;
//     if (status === 'Delivered') {
//       order.deliveredAt = new Date();
//       console.log('Setting deliveredAt:', order.deliveredAt);

//       // Process refund for Delivered status
//       const refundAmount = order.totals.baseTotal;
//       const gstDeduction = refundAmount * 0.18;
//       const netRefunded = refundAmount - gstDeduction;

//       // Validate refundAmount and gstDeduction
//       const expectedGstDeduction = order.totals.baseTotal * 0.18;
//       if (refundAmount !== order.totals.baseTotal || Math.abs(gstDeduction - expectedGstDeduction) > 0.01) {
//         console.error('Invalid refund data:', {
//           refundAmount,
//           expectedRefund: order.totals.baseTotal,
//           gstDeduction,
//           expectedGstDeduction,
//         });
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: 'Invalid refund amount or GST deduction' });
//       }

//       // Restore stock
//       const productIds = order.items.map((item) => new ObjectId(item._id));
//       const products = await Product.find({ _id: { $in: productIds } }).session(session);

//       for (const item of order.items) {
//         const product = products.find((p) => p._id.toString() === item._id.toString());
//         if (!product) {
//           console.error(`Product not found for stock restoration: ${item._id}`);
//           await session.abortTransaction();
//           session.endSession();
//           return res.status(404).json({ error: `Product not found: ${item.name}` });
//         }
//         product.stock += item.quantity;
//         await product.save({ session });
//         console.log(`Restored stock for ${product.name}:`, { newStock: product.stock });
//       }

//       // Credit wallet with refundAmount minus gstDeduction
//       const wallet = await Wallet.findOne({ userId: order.shipping.userId }).session(session);
//       if (!wallet) {
//         console.error('Wallet not found for user:', order.shipping.userId);
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: 'Wallet not found' });
//       }

//       wallet.balance += netRefunded;
//       wallet.transactions.push({
//         type: 'credit',
//         amount: netRefunded,
//         description: `Refund for delivered order #${order._id} after GST deduction`,
//         createdAt: new Date(),
//       });
//       await wallet.save({ session });
//       console.log('Wallet credited:', { userId: order.shipping.userId, netRefunded, newBalance: wallet.balance });

//       // Log transaction with GST deduction
//       await Transaction.create(
//         [{
//           userId: order.shipping.userId,
//           orderId: order._id,
//           type: 'refund',
//           amount: netRefunded,
//           gstDeduction,
//           description: `Refund for delivered order #${order._id} with GST fee`,
//           createdAt: new Date(),
//         }],
//         { session }
//       );

//       // Create notification for refund
//       const productNames = order.items.map((item) => item.name).join(', ');
//       const refundNotification = new Notification({
//         userId: order.shipping.userId,
//         message: `Order #${order._id} marked as delivered. ₹${netRefunded.toFixed(2)} refunded to your wallet after GST deduction.`,
//         imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
//         totalPrice: order.totals.baseTotal,
//         isRead: false,
//       });
//       await refundNotification.save({ session });
//       console.log('Refund notification created:', {
//         userId: order.shipping.userId,
//         message: refundNotification.message,
//         imageUrl: refundNotification.imageUrl,
//         totalPrice: refundNotification.totalPrice,
//       });

//       // Send refund confirmation email
//       const refundHtml = generateDeliveredRefundEmailContent(order, refundAmount, gstDeduction);
//       const refundMailOptions = {
//         from: `"Your Store" <${process.env.EMAIL_USER}>`,
//         to: order.shipping.email,
//         subject: `Order #${order._id} Delivered and Refund Confirmation`,
//         html: refundHtml,
//       };

//       await transporter.sendMail(refundMailOptions);
//       console.log('Refund confirmation email sent to:', order.shipping.email);

//       // Create delivery notification
//       const deliveryNotification = new Notification({
//         userId: order.shipping.userId,
//         message: `Order #${order._id} for ${productNames} has been delivered`,
//         imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
//         totalPrice: order.totals.baseTotal,
//         isRead: false,
//       });
//       await deliveryNotification.save({ session });
//       console.log('Delivery notification created:', {
//         userId: order.shipping.userId,
//         message: deliveryNotification.message,
//         imageUrl: deliveryNotification.imageUrl,
//         totalPrice: deliveryNotification.totalPrice,
//       });
//     }

//     await order.save({ session });
//     console.log(`Order ${req.params.id} status updated to ${status} by admin: ${req.user.email}`);

//     await session.commitTransaction();
//     session.endSession();

//     res.json({ 
//       message: `Order status updated to ${status}${status === 'Delivered' ? ' and refunded' : ''}`,
//       netRefunded: status === 'Delivered' ? (order.totals.baseTotal - (order.totals.baseTotal * 0.18)).toFixed(2) : undefined,
//       gstDeduction: status === 'Delivered' ? (order.totals.baseTotal * 0.18).toFixed(2) : undefined,
//     });
//   } catch (err) {
//     console.error('Status update error:', err.message, err.stack);
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ error: err.message || 'Failed to update order status' });
//   }
// });

// // Cancel order
// router.patch('/:id/cancel', authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { refundAmount, gstDeduction } = req.body;
//     console.log('Cancellation request:', { orderId: req.params.id, refundAmount, gstDeduction, user: req.user.email });

//     const order = await Order.findById(req.params.id).session(session);
//     if (!order) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ error: 'Order not found' });
//     }
//     if (
//       req.user.role !== 'admin' &&
//       order.shipping.email !== req.user.email &&
//       String(order.shipping.userId) !== req.user.id
//     ) {
//       console.warn('Unauthorized cancel:', {
//         orderEmail: order.shipping.email,
//         orderUserId: order.shipping.userId,
//         user: req.user,
//       });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ error: 'Unauthorized to cancel this order' });
//     }
//     if (order.status === 'Cancelled') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Order is already cancelled' });
//     }
//     if (order.status === 'Shipped' || order.status === 'Delivered') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Cannot cancel shipped or delivered order' });
//     }

//     // Validate refundAmount and gstDeduction
//     const expectedGstDeduction = order.totals.baseTotal * 0.18;
//     if (refundAmount !== order.totals.baseTotal || Math.abs(gstDeduction - expectedGstDeduction) > 0.01) {
//       console.error('Invalid refund data:', {
//         refundAmount,
//         expectedRefund: order.totals.baseTotal,
//         gstDeduction,
//         expectedGstDeduction,
//       });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Invalid refund amount or GST deduction' });
//     }

//     // Restore stock
//     const productIds = order.items.map((item) => new ObjectId(item._id));
//     const products = await Product.find({ _id: { $in: productIds } }).session(session);

//     for (const item of order.items) {
//       const product = products.find((p) => p._id.toString() === item._id.toString());
//       if (!product) {
//         console.error(`Product not found for stock restoration: ${item._id}`);
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(404).json({ error: `Product not found: ${item.name}` });
//       }
//       product.stock += item.quantity;
//       await product.save({ session });
//       console.log(`Restored stock for ${product.name}:`, { newStock: product.stock });
//     }

//     // Credit wallet with refundAmount minus gstDeduction
//     const wallet = await Wallet.findOne({ userId: order.shipping.userId }).session(session);
//     if (!wallet) {
//       console.error('Wallet not found for user:', order.shipping.userId);
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Wallet not found' });
//     }

//     const netRefunded = refundAmount - gstDeduction;
//     wallet.balance += netRefunded;
//     wallet.transactions.push({
//       type: 'credit',
//       amount: netRefunded,
//       description: `Refund for cancelled order #${order._id} after GST deduction`,
//       createdAt: new Date(),
//     });
//     await wallet.save({ session });
//     console.log('Wallet credited:', { userId: order.shipping.userId, netRefunded, newBalance: wallet.balance });

//     // Log transaction with GST deduction
//     await Transaction.create(
//       [{
//         userId: order.shipping.userId,
//         orderId: order._id,
//         type: 'refund',
//         amount: netRefunded,
//         gstDeduction,
//         description: `Refund for cancelled order #${order._id} with GST fee`,
//         createdAt: new Date(),
//       }],
//       { session }
//     );

//     // Create notification for refund
//     const productNames = order.items.map((item) => item.name).join(', ');
//     const notification = new Notification({
//       userId: order.shipping.userId,
//       message: `Order #${order._id} cancelled. ₹${netRefunded.toFixed(2)} refunded to your wallet after GST deduction.`,
//       imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
//       totalPrice: order.totals.baseTotal,
//       isRead: false,
//     });
//     await notification.save({ session });
//     console.log('Refund notification created:', {
//       userId: order.shipping.userId,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       totalPrice: notification.totalPrice,
//     });

//     // Update order status
//     order.status = 'Cancelled';
//     await order.save({ session });
//     console.log(`Order ${req.params.id} cancelled by user: ${req.user.email}`);

//     // Send cancellation confirmation email
//     const cancelHtml = generateCancelEmailContent(order, refundAmount, gstDeduction);
//     const cancelMailOptions = {
//       from: `"Your Store" <${process.env.EMAIL_USER}>`,
//       to: order.shipping.email,
//       subject: `Order #${order._id} Cancellation Confirmation`,
//       html: cancelHtml,
//     };

//     await transporter.sendMail(cancelMailOptions);
//     console.log('Cancellation confirmation email sent to:', order.shipping.email);

//     await session.commitTransaction();
//     session.endSession();

//     res.json({
//       message: `Order cancelled successfully. ₹${netRefunded.toFixed(2)} refunded to your wallet after GST deduction.`,
//       netRefunded,
//       gstDeduction,
//     });
//   } catch (err) {
//     console.error('Cancel order error:', err.message, err.stack);
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ error: err.message || 'Failed to cancel order' });
//   }
// });

// // Request return for an order
// router.patch('/:id/return/request', authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { returnReason, returnDetails } = req.body;
//     console.log('Return request:', { orderId: req.params.id, returnReason, returnDetails, user: req.user.email });

//     // Validate returnReason
//     if (!returnReason) {
//       console.error('Missing return reason');
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Return reason is required' });
//     }

//     const order = await Order.findById(req.params.id).session(session);
//     if (!order) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ error: 'Order not found' });
//     }
//     if (
//       req.user.role !== 'admin' &&
//       order.shipping.email !== req.user.email &&
//       String(order.shipping.userId) !== req.user.id
//     ) {
//       console.warn('Unauthorized return:', {
//         orderEmail: order.shipping.email,
//         orderUserId: order.shipping.userId,
//         user: req.user,
//       });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ error: 'Unauthorized to return this order' });
//     }
//     if (order.status !== 'Delivered') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Only delivered orders can be returned' });
//     }
//     if (order.status === 'Return Requested') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Return already requested for this order' });
//     }
//     if (order.status === 'Returned') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Order has already been returned' });
//     }

//     // Check return eligibility (within 5 days of delivery)
//     const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.createdAt);
//     const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
//     const currentDate = new Date();
//     if (currentDate - deliveryDate > fiveDaysInMs) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Return period has expired (5 days from delivery)' });
//     }

//     // Update order status and store return details
//     order.status = 'Return Requested';
//     order.returnDetails = { reason: returnReason, details: returnDetails || '' };
//     await order.save({ session });
//     console.log(`Return requested for order ${req.params.id} by user: ${req.user.email}`, { returnReason, returnDetails });

//     // Create notification for return request
//     const productNames = order.items.map((item) => item.name).join(', ');
//     const notification = new Notification({
//       userId: order.shipping.userId,
//       message: `Return requested for order #${order._id} for ${productNames}. Awaiting admin confirmation.`,
//       imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
//       totalPrice: order.totals.baseTotal,
//       isRead: false,
//     });
//     await notification.save({ session });
//     console.log('Return request notification created:', {
//       userId: order.shipping.userId,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       totalPrice: notification.totalPrice,
//     });

//     // Send return request confirmation email
//     const returnHtml = generateReturnEmailContent(order, returnReason, returnDetails);
//     const returnMailOptions = {
//       from: `"Your Store" <${process.env.EMAIL_USER}>`,
//       to: order.shipping.email,
//       subject: `Order #${order._id} Return Request Confirmation`,
//       html: returnHtml,
//     };

//     await transporter.sendMail(returnMailOptions);
//     console.log('Return request confirmation email sent to:', order.shipping.email);

//     await session.commitTransaction();
//     session.endSession();

//     res.json({
//       message: `Return requested successfully. Awaiting admin confirmation.`,
//     });
//   } catch (err) {
//     console.error('Return request error:', err.message, err.stack);
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ error: err.message || 'Failed to request return' });
//   }
// });

// // Confirm return for an order (Admin only)
// router.patch('/:id/return/confirm', authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { refundAmount, gstDeduction } = req.body;
//     console.log('Return confirmation request:', { orderId: req.params.id, refundAmount, gstDeduction, user: req.user.email });

//     // Check admin permissions
//     if (req.user.role !== 'admin') {
//       console.warn('Unauthorized return confirmation:', { user: req.user });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ error: 'Only admins can confirm returns' });
//     }

//     const order = await Order.findById(req.params.id).session(session);
//     if (!order) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ error: 'Order not found' });
//     }
//     if (order.status !== 'Return Requested') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Order is not in Return Requested status' });
//     }

//     // Validate refundAmount and gstDeduction
//     const expectedGstDeduction = order.totals.baseTotal * 0.18;
//     if (refundAmount !== order.totals.baseTotal || Math.abs(gstDeduction - expectedGstDeduction) > 0.01) {
//       console.error('Invalid refund data:', {
//         refundAmount,
//         expectedRefund: order.totals.baseTotal,
//         gstDeduction,
//         expectedGstDeduction,
//       });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Invalid refund amount or GST deduction' });
//     }

//     // Restore stock
//     const productIds = order.items.map((item) => new ObjectId(item._id));
//     const products = await Product.find({ _id: { $in: productIds } }).session(session);

//     for (const item of order.items) {
//       const product = products.find((p) => p._id.toString() === item._id.toString());
//       if (!product) {
//         console.error(`Product not found for stock restoration: ${item._id}`);
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(404).json({ error: `Product not found: ${item.name}` });
//       }
//       product.stock += item.quantity;
//       await product.save({ session });
//       console.log(`Restored stock for ${product.name}:`, { newStock: product.stock });
//     }

//     // Credit wallet with refundAmount minus gstDeduction
//     const wallet = await Wallet.findOne({ userId: order.shipping.userId }).session(session);
//     if (!wallet) {
//       console.error('Wallet not found for user:', order.shipping.userId);
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Wallet not found' });
//     }

//     const netRefunded = refundAmount - gstDeduction;
//     wallet.balance += netRefunded;
//     wallet.transactions.push({
//       type: 'credit',
//       amount: netRefunded,
//       description: `Refund for returned order #${order._id} after GST deduction`,
//       createdAt: new Date(),
//     });
//     await wallet.save({ session });
//     console.log('Wallet credited:', { userId: order.shipping.userId, netRefunded, newBalance: wallet.balance });

//     // Log transaction with GST deduction
//     await Transaction.create(
//       [{
//         userId: order.shipping.userId,
//         orderId: order._id,
//         type: 'refund',
//         amount: netRefunded,
//         gstDeduction,
//         description: `Refund for returned order #${order._id} with GST fee`,
//         createdAt: new Date(),
//       }],
//       { session }
//     );

//     // Create notification for return confirmation
//     const productNames = order.items.map((item) => item.name).join(', ');
//     const notification = new Notification({
//       userId: order.shipping.userId,
//       message: `Return for order #${order._id} confirmed. ₹${netRefunded.toFixed(2)} refunded to your wallet after GST deduction.`,
//       imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
//       totalPrice: order.totals.baseTotal,
//       isRead: false,
//     });
//     await notification.save({ session });
//     console.log('Return confirmation notification created:', {
//       userId: order.shipping.userId,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       totalPrice: notification.totalPrice,
//     });

//     // Update order status and store refund details
//     order.status = 'Returned';
//     order.refundedAmount = netRefunded;
//     await order.save({ session });
//     console.log(`Return confirmed for order ${req.params.id} by admin: ${req.user.email}`);

//     // Send return refund confirmation email
//     const returnHtml = generateReturnRefundEmailContent(order, refundAmount, gstDeduction);
//     const returnMailOptions = {
//       from: `"Your Store" <${process.env.EMAIL_USER}>`,
//       to: order.shipping.email,
//       subject: `Order #${order._id} Return and Refund Confirmation`,
//       html: returnHtml,
//     };

//     await transporter.sendMail(returnMailOptions);
//     console.log('Return refund confirmation email sent to:', order.shipping.email);

//     await session.commitTransaction();
//     session.endSession();

//     res.json({
//       message: `Return confirmed successfully. ₹${netRefunded.toFixed(2)} refunded to wallet after GST deduction.`,
//       netRefunded,
//       gstDeduction,
//     });
//   } catch (err) {
//     console.error('Return confirmation error:', err.message, err.stack);
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ error: err.message || 'Failed to confirm return' });
//   }
// });

// module.exports = router;






// const express = require('express');
// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;
// const Order = require('../models/Order');
// const Notification = require('../models/Notification');
// const Wallet = require('../models/Wallet');
// const Product = require('../models/Product');
// const Transaction = require('../models/Transaction');
// const fs = require('fs');
// const path = require('path');
// const jwt = require('jsonwebtoken');

// const router = express.Router();

// // Nodemailer Transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Middleware to verify JWT token
// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split('Bearer ')[1];
//   if (!token) {
//     console.error('No token provided in request');
//     return res.status(401).json({ error: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded token:', decoded);
//     req.user = decoded; // { id, email, name, role }
//     next();
//   } catch (err) {
//     console.error('Token verification error:', err.message);
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };

// // Normalize image URL for backend
// const normalizeImageUrl = (imageUrl) => {
//   const defaultPlaceholder = 'Uploads/placeholder.jpg';
//   if (!imageUrl) return defaultPlaceholder;
//   const normalized = imageUrl
//     .replace(/^http:\/\/localhost:5000/, '')
//     .replace(/^\/?[Uu]ploads\//, 'Uploads/');
//   return normalized.startsWith('Uploads/') ? normalized : defaultPlaceholder;
// };

// // Email Template for Order Confirmation
// const generateOrderEmailContent = (orderData) => {
//   const { items, formData, subtotal, gstAmount, promoApplied, validPromoDiscount, walletAmountUsed, baseTotal, totalAmount, promoCodes } = orderData;
//   const productNames = items.map((i) => i.name).join(', ');
//   const defaultPlaceholder = 'Uploads/placeholder.jpg';
//   const API_BASE = process.env.API_BASE || 'http://localhost:5000';

//   const itemsHtml = items
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

//       console.log(`Processing image for ${item.name}:`, {
//         imageUrl,
//         imagePath,
//         exists: fs.existsSync(imagePath),
//         finalImageUrl,
//         fallbackUrl,
//         cid,
//       });

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
//       <h2 style="color: #28a745; text-align: center;">Order Confirmation</h2>
//       <p style="color: #333; text-align: center;">Thank you for your purchase, ${formData.name || 'Customer'}!</p>
//       <p style="color: #555; text-align: center;">Your order for ${productNames} has been successfully placed.</p>

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
//           <td style="padding: 5px; text-align: right;">${subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px;">GST (18%)</td>
//           <td style="padding: 5px; text-align: right;">${gstAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         ${
//           promoApplied
//             ? `
//               <tr style="color: #28a745;">
//                 <td style="padding: 5px;">Promo Discount (${promoCodes[promoApplied].label})</td>
//                 <td style="padding: 5px; text-align: right;">-${validPromoDiscount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//               </tr>
//             `
//             : ''
//         }
//         ${
//           walletAmountUsed > 0
//             ? `
//               <tr style="color: #28a745;">
//                 <td style="padding: 5px;">Wallet Payment</td>
//                 <td style="padding: 5px; text-align: right;">-${walletAmountUsed.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//               </tr>
//             `
//             : ''
//         }
//         <tr>
//           <td style="padding: 5px;">Total (Before Payments)</td>
//           <td style="padding: 5px; text-align: right;">${baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr style="font-weight: bold; color: #333;">
//           <td style="padding: 5px;">${formData.paymentMethod} Payment</td>
//           <td style="padding: 5px; text-align: right;">${totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//       </table>

//       <h3 style="color: #333; margin-top: 20px;">Shipping Information</h3>
//       <p style="color: #555;">
//         <strong>Name:</strong> ${formData.name || 'N/A'}<br />
//         <strong>Address:</strong> ${formData.address || 'N/A'}, ${formData.city || 'N/A'}, ${formData.postalCode || 'N/A'}<br />
//         <strong>Phone:</strong> ${formData.phone || 'N/A'}<br />
//         <strong>Email:</strong> ${formData.email || 'N/A'}
//       </p>

//       <h3 style="color: #333; margin-top: 20px;">Payment Method</h3>
//       <p style="color: #555;"><strong>Method:</strong> ${formData.paymentMethod}${formData.upiProvider ? ` (${formData.upiProvider})` : ''}${walletAmountUsed > 0 ? ' + Wallet' : ''}</p>

//       <p style="color: #555; text-align: center; margin-top: 20px;">
//         We'll notify you when your order ships. Contact us at support@example.com.
//       </p>
//       <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
//     </div>
//   `;

//   return { html: htmlContent, items };
// };

// // Email Template for Cancellation Confirmation
// const generateCancelEmailContent = (order, refundAmount, gstDeduction) => {
//   const productNames = order.items.map((item) => item.name).join(', ');
//   const netRefunded = refundAmount - gstDeduction;
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//       <h2 style="color: #dc2626; text-align: center;">Order Cancellation Confirmation</h2>
//       <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
//       <p style="color: #555; text-align: center;">Your order #${order._id} for ${productNames} has been cancelled.</p>

//       <h3 style="color: #333; margin-top: 20px;">Refund Details</h3>
//       <table style="width: 100%; color: #555;">
//         <tr>
//           <td style="padding: 5px;">Order Total</td>
//           <td style="padding: 5px; text-align: right;">${order.totals.baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px;">GST Deduction (18%)</td>
//           <td style="padding: 5px; text-align: right;">-${gstDeduction.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr style="font-weight: bold; color: #333;">
//           <td style="padding: 5px;">Refunded to Wallet</td>
//           <td style="padding: 5px; text-align: right;">${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//       </table>

//       <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
//       <p style="color: #555;">Items: ${productNames}</p>
//       <p style="color: #555;">Status: Cancelled</p>

//       <p style="color: #555; text-align: center; margin-top: 20px;">
//         The refund of ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} has been credited to your wallet after deducting the GST fee. Contact us at support@example.com for any queries.
//       </p>
//       <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
//     </div>
//   `;

//   return htmlContent;
// };

// // Email Template for Return Request Confirmation
// const generateReturnEmailContent = (order, returnReason, returnDetails) => {
//   const productNames = order.items.map((item) => item.name).join(', ');
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//       <h2 style="color: #ff9800; text-align: center;">Return Request Confirmation</h2>
//       <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
//       <p style="color: #555; text-align: center;">Your return request for order #${order._id} for ${productNames} has been received.</p>

//       <h3 style="color: #333; margin-top: 20px;">Return Details</h3>
//       <p style="color: #555;">
//         <strong>Reason:</strong> ${returnReason}<br />
//         <strong>Additional Details:</strong> ${returnDetails || 'None provided'}
//       </p>

//       <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
//       <p style="color: #555;">Items: ${productNames}</p>
//       <p style="color: #555;">Status: Return Requested</p>

//       <p style="color: #555; text-align: center; margin-top: 20px;">
//         Please return the items within 7 days to our warehouse at: 123 Commerce Street, City, Country, ZIP 12345. Your refund will be processed after we receive and verify the returned items. Contact us at support@example.com for return instructions or queries.
//       </p>
//       <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
//     </div>
//   `;

//   return htmlContent;
// };

// // Email Template for Return Refund Confirmation
// const generateReturnRefundEmailContent = (order, refundAmount, gstDeduction) => {
//   const productNames = order.items.map((item) => item.name).join(', ');
//   const netRefunded = refundAmount - gstDeduction;
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//       <h2 style="color: #28a745; text-align: center;">Return and Refund Confirmation</h2>
//       <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
//       <p style="color: #555; text-align: center;">Your return for order #${order._id} for ${productNames} has been received and processed.</p>

//       <h3 style="color: #333; margin-top: 20px;">Refund Details</h3>
//       <table style="width: 100%; color: #555;">
//         <tr>
//           <td style="padding: 5px;">Order Total</td>
//           <td style="padding: 5px; text-align: right;">${order.totals.baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px;">GST Deduction (18%)</td>
//           <td style="padding: 5px; text-align: right;">-${gstDeduction.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr style="font-weight: bold; color: #333;">
//           <td style="padding: 5px;">Refunded to Wallet</td>
//           <td style="padding: 5px; text-align: right;">${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//       </table>

//       <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
//       <p style="color: #555;">Items: ${productNames}</p>
//       <p style="color: #555;">Status: Returned</p>

//       <p style="color: #555; text-align: center; margin-top: 20px;">
//         The refund of ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} has been credited to your wallet after deducting the GST fee. Contact us at support@example.com for any queries.
//       </p>
//       <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
//     </div>
//   `;

//   return htmlContent;
// };

// // Email Template for Delivered Refund Confirmation
// const generateDeliveredRefundEmailContent = (order, refundAmount, gstDeduction) => {
//   const productNames = order.items.map((item) => item.name).join(', ');
//   const netRefunded = refundAmount - gstDeduction;
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//       <h2 style="color: #28a745; text-align: center;">Order Delivered and Refund Confirmation</h2>
//       <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
//       <p style="color: #555; text-align: center;">Your order #${order._id} for ${productNames} has been marked as delivered and refunded.</p>

//       <h3 style="color: #333; margin-top: 20px;">Refund Details</h3>
//       <table style="width: 100%; color: #555;">
//         <tr>
//           <td style="padding: 5px;">Order Total</td>
//           <td style="padding: 5px; text-align: right;">${order.totals.baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px;">GST Deduction (18%)</td>
//           <td style="padding: 5px; text-align: right;">-${gstDeduction.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//         <tr style="font-weight: bold; color: #333;">
//           <td style="padding: 5px;">Refunded to Wallet</td>
//           <td style="padding: 5px; text-align: right;">${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
//         </tr>
//       </table>

//       <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
//       <p style="color: #555;">Items: ${productNames}</p>
//       <p style="color: #555;">Status: Delivered and Refunded</p>

//       <p style="color: #555; text-align: center; margin-top: 20px;">
//         The refund of ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} has been credited to your wallet after deducting the GST fee. Contact us at support@example.com for any queries.
//       </p>
//       <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
//     </div>
//   `;

//   return htmlContent;
// };

// // POST /api/orders/send-confirmation
// router.post('/send-confirmation', authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const {
//       items,
//       formData,
//       subtotal,
//       gstAmount,
//       promoApplied,
//       validPromoDiscount,
//       walletAmountUsed,
//       baseTotal,
//       totalAmount,
//       promoCodes,
//     } = req.body;

//     // Validate required fields
//     const missingFields = [];
//     if (!items || !items.length) missingFields.push('items');
//     if (!formData) missingFields.push('formData');
//     else {
//       if (!formData.email) missingFields.push('formData.email');
//       if (!formData.name) missingFields.push('formData.name');
//       if (!formData.phone) missingFields.push('formData.phone');
//       if (!formData.address) missingFields.push('formData.address');
//       if (!formData.city) missingFields.push('formData.city');
//       if (!formData.postalCode) missingFields.push('formData.postalCode');
//       if (!formData.paymentMethod) missingFields.push('formData.paymentMethod');
//     }
//     if (subtotal === undefined || subtotal < 0) missingFields.push('subtotal');
//     if (gstAmount === undefined || gstAmount < 0) missingFields.push('gstAmount');
//     if (baseTotal === undefined || baseTotal < 0) missingFields.push('baseTotal');
//     if (totalAmount === undefined || totalAmount < 0) missingFields.push('totalAmount');

//     if (missingFields.length > 0) {
//       console.error('Invalid order data:', {
//         missingFields,
//         itemsCount: items?.length,
//         formData: formData || 'undefined',
//         subtotal,
//         gstAmount,
//         baseTotal,
//         totalAmount,
//         walletAmountUsed,
//       });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: `Missing required order data: ${missingFields.join(', ')}` });
//     }

//     // Verify email matches authenticated user
//     if (formData.email !== req.user.email) {
//       console.warn('Email mismatch:', formData.email, 'vs', req.user.email);
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ error: 'Email does not match authenticated user' });
//     }

//     // Validate items have _id, name, price, quantity, and valid ObjectId
//     const invalidItems = items.filter(
//       (item) => !item._id || !ObjectId.isValid(item._id) || !item.name || !item.price || !item.quantity
//     );
//     if (invalidItems.length > 0) {
//       console.error('Invalid items:', invalidItems.map((i) => ({
//         _id: i._id,
//         name: i.name,
//         price: i.price,
//         quantity: i.quantity,
//         isValidObjectId: i._id ? ObjectId.isValid(i._id) : false,
//       })));
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'All items must have a valid ObjectId _id, name, price, and quantity' });
//     }

//     // Log incoming items for debugging
//     console.log('Received items:', items.map((item) => ({
//       _id: item._id,
//       name: item.name,
//       imageUrl: item.imageUrl,
//       quantity: item.quantity,
//     })));

//     // Validate and update stock
//     const productIds = items.map((item) => new ObjectId(item._id));
//     const products = await Product.find({ _id: { $in: productIds } }).session(session);

//     for (const item of items) {
//       const product = products.find((p) => p._id.toString() === item._id);
//       if (!product) {
//         console.error(`Product not found for ID: ${item._id}, Name: ${item.name}`);
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(404).json({ error: `Product not found: ${item.name} (ID: ${item._id})` });
//       }
//       if (product.stock < item.quantity) {
//         console.error(`Insufficient stock for ${item.name}:`, { available: product.stock, requested: item.quantity });
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: `Insufficient stock for ${item.name}: only ${product.stock} available` });
//       }
//       product.stock -= item.quantity;
//       await product.save({ session });
//       console.log(`Updated stock for ${product.name}:`, { newStock: product.stock });
//     }

//     // Handle wallet payment
//     if (walletAmountUsed > 0) {
//       const wallet = await Wallet.findOne({ userId: req.user.id }).session(session);
//       if (!wallet) {
//         console.error('Wallet not found for user:', req.user.id);
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: 'Wallet not found' });
//       }
//       if (wallet.balance < walletAmountUsed) {
//         console.error('Insufficient wallet balance:', { balance: wallet.balance, requested: walletAmountUsed });
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: `Insufficient wallet balance: ${wallet.balance} < ${walletAmountUsed}` });
//       }

//       // Deduct wallet balance
//       wallet.balance -= walletAmountUsed;
//       wallet.transactions.push({
//         type: 'debit',
//         amount: walletAmountUsed,
//         description: `Order payment for ${items.map((i) => i.name).join(', ')}`,
//         createdAt: new Date(),
//       });
//       await wallet.save({ session });
//       console.log('Wallet updated:', { userId: req.user.id, newBalance: wallet.balance });

//       // Log transaction
//       await Transaction.create(
//         [{
//           userId: req.user.id,
//           orderId: null, // Order ID not yet available
//           type: 'debit',
//           amount: walletAmountUsed,
//           description: `Wallet payment for order`,
//           createdAt: new Date(),
//         }],
//         { session }
//       );
//     }

//     // Save order to MongoDB
//     const order = new Order({
//       userId: req.user.id,
//       items: items.map((item) => ({
//         _id: new ObjectId(item._id),
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         imageUrl: normalizeImageUrl(item.imageUrl),
//       })),
//       shipping: {
//         name: formData.name,
//         phone: formData.phone,
//         email: formData.email,
//         address: formData.address,
//         city: formData.city,
//         postalCode: formData.postalCode,
//         userId: req.user.id,
//       },
//       payment: {
//         method: formData.paymentMethod,
//         upiId: formData.upiId || '',
//         cardLastFour: formData.cardNumber ? formData.cardNumber.slice(-4) : '',
//         upiProvider: formData.upiProvider || '',
//       },
//       totals: {
//         subtotal,
//         gstAmount,
//         promoDiscount: validPromoDiscount || 0,
//         walletAmountUsed: walletAmountUsed || 0,
//         baseTotal,
//         totalAmount,
//         promoCode: promoApplied || '',
//       },
//       deliveredAt: null, // Initialize deliveredAt
//     });

//     const savedOrder = await order.save({ session });
//     console.log('Order saved:', { id: savedOrder._id, email: savedOrder.shipping.email, userId: savedOrder.shipping.userId });

//     // Update transaction with order ID
//     if (walletAmountUsed > 0) {
//       await Transaction.updateMany(
//         { userId: req.user.id, orderId: null, type: 'debit', amount: walletAmountUsed },
//         { orderId: savedOrder._id },
//         { session }
//       );
//     }

//     // Create notification with image and total price
//     const productNames = items.map((item) => item.name).join(', ');
//     const notification = new Notification({
//       userId: req.user.id,
//       message: `Order placed successfully for: ${productNames}`,
//       imageUrl: normalizeImageUrl(items[0]?.imageUrl),
//       totalPrice: baseTotal,
//       isRead: false,
// ública
//     });
//     await notification.save({ session });
//     console.log('Notification created:', {
//       userId: req.user.id,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       totalPrice: notification.totalPrice,
//     });

//     // Prepare email attachments
//     const { html, items: emailItems } = generateOrderEmailContent(req.body);
//     const defaultPlaceholder = 'Uploads/placeholder.jpg';
//     const defaultPlaceholderPath = path.join(__dirname, '..', 'public', defaultPlaceholder);

//     // Log if default placeholder is missing
//     if (!fs.existsSync(defaultPlaceholderPath)) {
//       console.warn(`Default placeholder not found: ${defaultPlaceholderPath}`);
//     }

//     const attachments = emailItems
//       .map((item, index) => {
//         let imageUrl = normalizeImageUrl(item.imageUrl);
//         let imagePath = path.join(__dirname, '..', 'public', imageUrl);

//         if (!fs.existsSync(imagePath)) {
//           console.warn(`Image file not found for ${item.name}: ${imagePath}, using default placeholder`);
//           imagePath = defaultPlaceholderPath;
//           imageUrl = defaultPlaceholder;
//         }

//         if (!fs.existsSync(imagePath)) {
//           console.error(`Skipping attachment for ${item.name}: ${imagePath} does not exist`);
//           return null;
//         }

//         console.log(`Attaching image for ${item.name}:`, { imageUrl, imagePath, exists: fs.existsSync(imagePath) });

//         return {
//           filename: path.basename(imageUrl),
//           path: imagePath,
//           cid: `image-${index}@ecommerce`,
//         };
//       })
//       .filter((attachment) => attachment !== null);

//     console.log('Email attachments:', attachments.map((a) => ({ filename: a.filename, path: a.path, cid: a.cid })));

//     // Send confirmation email
//     const mailOptions = {
//       from: `"Your Store" <${process.env.EMAIL_USER}>`,
//       to: formData.email,
//       subject: `Order Confirmation #${savedOrder._id}`,
//       html,
//       attachments,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Confirmation email sent to:', formData.email);

//     // Commit transaction
//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       productNames,
//       orderId: savedOrder._id,
//       message: 'Order processed, notification created, and email sent',
//     });
//   } catch (error) {
//     console.error('Error processing order:', error.message, error.stack);
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ error: error.message || 'Failed to process order' });
//   }
// });

// // Get all orders (admins get all, users get their own)
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     console.log('Fetching orders for:', { email: req.user.email, userId: req.user.id, role: req.user.role });
//     let orders;
//     if (req.user.role === 'admin') {
//       orders = await Order.find({});
//     } else {
//       orders = await Order.find({
//         $or: [{ 'shipping.email': req.user.email }, { 'shipping.userId': req.user.id }],
//       });
//     }
//     console.log('Fetched orders:', orders.length, 'for user:', req.user.email);
//     res.json(orders);
//   } catch (err) {
//     console.error('Error fetching orders:', err.message);
//     res.status(500).json({ error: 'Failed to fetch orders' });
//   }
// });

// // Get single order by ID
// router.get('/:id', authMiddleware, async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ error: 'Order not found' });
//     if (
//       req.user.role !== 'admin' &&
//       order.shipping.email !== req.user.email &&
//       String(order.shipping.userId) !== req.user.id
//     ) {
//       console.warn('Unauthorized access:', {
//         orderEmail: order.shipping.email,
//         orderUserId: order.shipping.userId,
//         user: req.user,
//       });
//       return res.status(403).json({ error: 'Unauthorized access to order' });
//     }
//     res.json(order);
//   } catch (err) {
//     console.error('Error fetching order:', err.message);
//     res.status(500).json({ error: 'Failed to fetch order' });
//   }
// });

// // Update order status (e.g., to Delivered)
// router.patch('/:id/status', authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { status } = req.body;
//     console.log('Status update request:', { orderId: req.params.id, status, user: req.user });

//     // Validate status
//     if (!['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'].includes(status)) {
//       console.error('Invalid status provided:', status);
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Invalid status' });
//     }

//     // Fetch order
//     const order = await Order.findById(req.params.id).session(session);
//     if (!order) {
//       console.error('Order not found:', req.params.id);
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ error: 'Order not found' });
//     }
//     console.log('Order found:', { orderId: order._id, currentStatus: order.status, email: order.shipping.email });

//     // Check admin permissions
//     if (req.user.role !== 'admin') {
//       console.warn('Unauthorized status update:', {
//         orderEmail: order.shipping.email,
//         orderUserId: order.shipping.userId,
//         user: req.user,
//       });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ error: 'Only admins can update order status' });
//     }

//     // Prevent status change for cancelled or returned orders
//     if (order.status === 'Cancelled' || order.status === 'Returned') {
//       console.error('Cannot change status:', { orderId: order._id, currentStatus: order.status, attemptedStatus: status });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: `Cannot change status of ${order.status.toLowerCase()} order` });
//     }

//     // Update order status
//     order.status = status;
//     if (status === 'Delivered') {
//       order.deliveredAt = new Date();
//       console.log('Setting deliveredAt:', order.deliveredAt);

//       // Process refund for Delivered status
//       const refundAmount = order.totals.baseTotal;
//       const gstDeduction = refundAmount * 0.18;
//       const netRefunded = refundAmount - gstDeduction;

//       // Validate refundAmount and gstDeduction
//       const expectedGstDeduction = order.totals.baseTotal * 0.18;
//       if (refundAmount !== order.totals.baseTotal || Math.abs(gstDeduction - expectedGstDeduction) > 0.01) {
//         console.error('Invalid refund data:', {
//           refundAmount,
//           expectedRefund: order.totals.baseTotal,
//           gstDeduction,
//           expectedGstDeduction,
//         });
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: 'Invalid refund amount or GST deduction' });
//       }

//       // Restore stock
//       const productIds = order.items.map((item) => new ObjectId(item._id));
//       const products = await Product.find({ _id: { $in: productIds } }).session(session);

//       for (const item of order.items) {
//         const product = products.find((p) => p._id.toString() === item._id.toString());
//         if (!product) {
//           console.error(`Product not found for stock restoration: ${item._id}`);
//           await session.abortTransaction();
//           session.endSession();
//           return res.status(404).json({ error: `Product not found: ${item.name}` });
//         }
//         product.stock += item.quantity;
//         await product.save({ session });
//         console.log(`Restored stock for ${product.name}:`, { newStock: product.stock });
//       }

//       // Credit wallet with refundAmount minus gstDeduction
//       const wallet = await Wallet.findOne({ userId: order.shipping.userId }).session(session);
//       if (!wallet) {
//         console.error('Wallet not found for user:', order.shipping.userId);
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: 'Wallet not found' });
//       }

//       wallet.balance += netRefunded;
//       wallet.transactions.push({
//         type: 'credit',
//         amount: netRefunded,
//         description: `Refund for delivered order #${order._id} after GST deduction`,
//         createdAt: new Date(),
//       });
//       await wallet.save({ session });
//       console.log('Wallet credited:', { userId: order.shipping.userId, netRefunded, newBalance: wallet.balance });

//       // Log transaction with GST deduction
//       await Transaction.create(
//         [{
//           userId: order.shipping.userId,
//           orderId: order._id,
//           type: 'refund',
//           amount: netRefunded,
//           gstDeduction,
//           description: `Refund for delivered order #${order._id} with GST fee`,
//           createdAt: new Date(),
//         }],
//         { session }
//       );

//       // Create notification for refund
//       const productNames = order.items.map((item) => item.name).join(', ');
//       const refundNotification = new Notification({
//         userId: order.shipping.userId,
//         message: `Order #${order._id} marked as delivered. ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} refunded to your wallet after GST deduction.`,
//         imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
//         totalPrice: order.totals.baseTotal,
//         isRead: false,
//       });
//       await refundNotification.save({ session });
//       console.log('Refund notification created:', {
//         userId: order.shipping.userId,
//         message: refundNotification.message,
//         imageUrl: refundNotification.imageUrl,
//         totalPrice: refundNotification.totalPrice,
//       });

//       // Send refund confirmation email
//       const refundHtml = generateDeliveredRefundEmailContent(order, refundAmount, gstDeduction);
//       const refundMailOptions = {
//         from: `"Your Store" <${process.env.EMAIL_USER}>`,
//         to: order.shipping.email,
//         subject: `Order #${order._id} Delivered and Refund Confirmation`,
//         html: refundHtml,
//       };

//       await transporter.sendMail(refundMailOptions);
//       console.log('Refund confirmation email sent to:', order.shipping.email);

//       // Create delivery notification
//       const deliveryNotification = new Notification({
//         userId: order.shipping.userId,
//         message: `Order #${order._id} for ${productNames} has been delivered`,
//         imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
//         totalPrice: order.totals.baseTotal,
//         isRead: false,
//       });
//       await deliveryNotification.save({ session });
//       console.log('Delivery notification created:', {
//         userId: order.shipping.userId,
//         message: deliveryNotification.message,
//         imageUrl: deliveryNotification.imageUrl,
//         totalPrice: deliveryNotification.totalPrice,
//       });
//     }

//     await order.save({ session });
//     console.log(`Order ${req.params.id} status updated to ${status} by admin: ${req.user.email}`);

//     await session.commitTransaction();
//     session.endSession();

//     res.json({ 
//       message: `Order status updated to ${status}${status === 'Delivered' ? ' and refunded' : ''}`,
//       netRefunded: status === 'Delivered' ? netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : undefined,
//       gstDeduction: status === 'Delivered' ? gstDeduction.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : undefined,
//     });
//   } catch (err) {
//     console.error('Status update error:', err.message, err.stack);
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ error: err.message || 'Failed to update order status' });
//   }
// });

// // Cancel order
// router.patch('/:id/cancel', authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { refundAmount, gstDeduction } = req.body;
//     console.log('Cancellation request:', { orderId: req.params.id, refundAmount, gstDeduction, user: req.user.email });

//     const order = await Order.findById(req.params.id).session(session);
//     if (!order) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ error: 'Order not found' });
//     }
//     if (
//       req.user.role !== 'admin' &&
//       order.shipping.email !== req.user.email &&
//       String(order.shipping.userId) !== req.user.id
//     ) {
//       console.warn('Unauthorized cancel:', {
//         orderEmail: order.shipping.email,
//         orderUserId: order.shipping.userId,
//         user: req.user,
//       });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ error: 'Unauthorized to cancel this order' });
//     }
//     if (order.status === 'Cancelled') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Order is already cancelled' });
//     }
//     if (order.status === 'Shipped' || order.status === 'Delivered') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Cannot cancel shipped or delivered order' });
//     }

//     // Validate refundAmount and gstDeduction
//     const expectedGstDeduction = order.totals.baseTotal * 0.18;
//     if (refundAmount !== order.totals.baseTotal || Math.abs(gstDeduction - expectedGstDeduction) > 0.01) {
//       console.error('Invalid refund data:', {
//         refundAmount,
//         expectedRefund: order.totals.baseTotal,
//         gstDeduction,
//         expectedGstDeduction,
//       });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Invalid refund amount or GST deduction' });
//     }

//     // Restore stock
//     const productIds = order.items.map((item) => new ObjectId(item._id));
//     const products = await Product.find({ _id: { $in: productIds } }).session(session);

//     for (const item of order.items) {
//       const product = products.find((p) => p._id.toString() === item._id.toString());
//       if (!product) {
//         console.error(`Product not found for stock restoration: ${item._id}`);
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(404).json({ error: `Product not found: ${item.name}` });
//       }
//       product.stock += item.quantity;
//       await product.save({ session });
//       console.log(`Restored stock for ${product.name}:`, { newStock: product.stock });
//     }

//     // Credit wallet with refundAmount minus gstDeduction
//     const wallet = await Wallet.findOne({ userId: order.shipping.userId }).session(session);
//     if (!wallet) {
//       console.error('Wallet not found for user:', order.shipping.userId);
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Wallet not found' });
//     }

//     const netRefunded = refundAmount - gstDeduction;
//     wallet.balance += netRefunded;
//     wallet.transactions.push({
//       type: 'credit',
//       amount: netRefunded,
//       description: `Refund for cancelled order #${order._id} after GST deduction`,
//       createdAt: new Date(),
//     });
//     await wallet.save({ session });
//     console.log('Wallet credited:', { userId: order.shipping.userId, netRefunded, newBalance: wallet.balance });

//     // Log transaction with GST deduction
//     await Transaction.create(
//       [{
//         userId: order.shipping.userId,
//         orderId: order._id,
//         type: 'refund',
//         amount: netRefunded,
//         gstDeduction,
//         description: `Refund for cancelled order #${order._id} with GST fee`,
//         createdAt: new Date(),
//       }],
//       { session }
//     );

//     // Create notification for refund
//     const productNames = order.items.map((item) => item.name).join(', ');
//     const notification = new Notification({
//       userId: order.shipping.userId,
//       message: `Order #${order._id} cancelled. ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} refunded to your wallet after GST deduction.`,
//       imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
//       totalPrice: order.totals.baseTotal,
//       isRead: false,
//     });
//     await notification.save({ session });
//     console.log('Refund notification created:', {
//       userId: order.shipping.userId,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       totalPrice: notification.totalPrice,
//     });

//     // Update order status
//     order.status = 'Cancelled';
//     await order.save({ session });
//     console.log(`Order ${req.params.id} cancelled by user: ${req.user.email}`);

//     // Send cancellation confirmation email
//     const cancelHtml = generateCancelEmailContent(order, refundAmount, gstDeduction);
//     const cancelMailOptions = {
//       from: `"Your Store" <${process.env.EMAIL_USER}>`,
//       to: order.shipping.email,
//       subject: `Order #${order._id} Cancellation Confirmation`,
//       html: cancelHtml,
//     };

//     await transporter.sendMail(cancelMailOptions);
//     console.log('Cancellation confirmation email sent to:', order.shipping.email);

//     await session.commitTransaction();
//     session.endSession();

//     res.json({
//       message: `Order cancelled successfully. ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} refunded to your wallet after GST deduction.`,
//       netRefunded,
//       gstDeduction,
//     });
//   } catch (err) {
//     console.error('Cancel order error:', err.message, err.stack);
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ error: err.message || 'Failed to cancel order' });
//   }
// });

// // Request return for an order
// router.patch('/:id/return/request', authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { returnReason, returnDetails } = req.body;
//     console.log('Return request:', { orderId: req.params.id, returnReason, returnDetails, user: req.user.email });

//     // Validate returnReason
//     if (!returnReason) {
//       console.error('Missing return reason');
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Return reason is required' });
//     }

//     const order = await Order.findById(req.params.id).session(session);
//     if (!order) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ error: 'Order not found' });
//     }
//     if (
//       req.user.role !== 'admin' &&
//       order.shipping.email !== req.user.email &&
//       String(order.shipping.userId) !== req.user.id
//     ) {
//       console.warn('Unauthorized return:', {
//         orderEmail: order.shipping.email,
//         orderUserId: order.shipping.userId,
//         user: req.user,
//       });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ error: 'Unauthorized to return this order' });
//     }
//     if (order.status !== 'Delivered') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Only delivered orders can be returned' });
//     }
//     if (order.status === 'Return Requested') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Return already requested for this order' });
//     }
//     if (order.status === 'Returned') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Order has already been returned' });
//     }

//     // Check return eligibility (within 5 days of delivery)
//     const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.createdAt);
//     const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
//     const currentDate = new Date();
//     if (currentDate - deliveryDate > fiveDaysInMs) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Return period has expired (5 days from delivery)' });
//     }

//     // Update order status and store return details
//     order.status = 'Return Requested';
//     order.returnDetails = { reason: returnReason, details: returnDetails || '' };
//     await order.save({ session });
//     console.log(`Return requested for order ${req.params.id} by user: ${req.user.email}`, { returnReason, returnDetails });

//     // Create notification for return request
//     const productNames = order.items.map((item) => item.name).join(', ');
//     const notification = new Notification({
//       userId: order.shipping.userId,
//       message: `Return requested for order #${order._id} for ${productNames}. Awaiting admin confirmation.`,
//       imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
//       totalPrice: order.totals.baseTotal,
//       isRead: false,
//     });
//     await notification.save({ session });
//     console.log('Return request notification created:', {
//       userId: order.shipping.userId,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       totalPrice: notification.totalPrice,
//     });

//     // Send return request confirmation email
//     const returnHtml = generateReturnEmailContent(order, returnReason, returnDetails);
//     const returnMailOptions = {
//       from: `"Your Store" <${process.env.EMAIL_USER}>`,
//       to: order.shipping.email,
//       subject: `Order #${order._id} Return Request Confirmation`,
//       html: returnHtml,
//     };

//     await transporter.sendMail(returnMailOptions);
//     console.log('Return request confirmation email sent to:', order.shipping.email);

//     await session.commitTransaction();
//     session.endSession();

//     res.json({
//       message: `Return requested successfully. Awaiting admin confirmation.`,
//     });
//   } catch (err) {
//     console.error('Return request error:', err.message, err.stack);
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ error: err.message || 'Failed to request return' });
//   }
// });

// // Confirm return for an order (Admin only)
// router.patch('/:id/return/confirm', authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { refundAmount, gstDeduction } = req.body;
//     console.log('Return confirmation request:', { orderId: req.params.id, refundAmount, gstDeduction, user: req.user.email });

//     // Check admin permissions
//     if (req.user.role !== 'admin') {
//       console.warn('Unauthorized return confirmation:', { user: req.user });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ error: 'Only admins can confirm returns' });
//     }

//     const order = await Order.findById(req.params.id).session(session);
//     if (!order) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ error: 'Order not found' });
//     }
//     if (order.status !== 'Return Requested') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Order is not in Return Requested status' });
//     }

//     // Validate refundAmount and gstDeduction
//     const expectedGstDeduction = order.totals.baseTotal * 0.18;
//     if (refundAmount !== order.totals.baseTotal || Math.abs(gstDeduction - expectedGstDeduction) > 0.01) {
//       console.error('Invalid refund data:', {
//         refundAmount,
//         expectedRefund: order.totals.baseTotal,
//         gstDeduction,
//         expectedGstDeduction,
//       });
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Invalid refund amount or GST deduction' });
//     }

//     // Restore stock
//     const productIds = order.items.map((item) => new ObjectId(item._id));
//     const products = await Product.find({ _id: { $in: productIds } }).session(session);

//     for (const item of order.items) {
//       const product = products.find((p) => p._id.toString() === item._id.toString());
//       if (!product) {
//         console.error(`Product not found for stock restoration: ${item._id}`);
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(404).json({ error: `Product not found: ${item.name}` });
//       }
//       product.stock += item.quantity;
//       await product.save({ session });
//       console.log(`Restored stock for ${product.name}:`, { newStock: product.stock });
//     }

//     // Credit wallet with refundAmount minus gstDeduction
//     const wallet = await Wallet.findOne({ userId: order.shipping.userId }).session(session);
//     if (!wallet) {
//       console.error('Wallet not found for user:', order.shipping.userId);
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ error: 'Wallet not found' });
//     }

//     const netRefunded = refundAmount - gstDeduction;
//     wallet.balance += netRefunded;
//     wallet.transactions.push({
//       type: 'credit',
//       amount: netRefunded,
//       description: `Refund for returned order #${order._id} after GST deduction`,
//       createdAt: new Date(),
//     });
//     await wallet.save({ session });
//     console.log('Wallet credited:', { userId: order.shipping.userId, netRefunded, newBalance: wallet.balance });

//     // Log transaction with GST deduction
//     await Transaction.create(
//       [{
//         userId: order.shipping.userId,
//         orderId: order._id,
//         type: 'refund',
//         amount: netRefunded,
//         gstDeduction,
//         description: `Refund for returned order #${order._id} with GST fee`,
//         createdAt: new Date(),
//       }],
//       { session }
//     );

//     // Create notification for return confirmation
//     const productNames = order.items.map((item) => item.name).join(', ');
//     const notification = new Notification({
//       userId: order.shipping.userId,
//       message: `Return for order #${order._id} confirmed. ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} refunded to your wallet after GST deduction.`,
//       imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
//       totalPrice: order.totals.baseTotal,
//       isRead: false,
//     });
//     await notification.save({ session });
//     console.log('Return confirmation notification created:', {
//       userId: order.shipping.userId,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       totalPrice: notification.totalPrice,
//     });

//     // Update order status and store refund details
//     order.status = 'Returned';
//     order.refundedAmount = netRefunded;
//     await order.save({ session });
//     console.log(`Return confirmed for order ${req.params.id} by admin: ${req.user.email}`);

//     // Send return refund confirmation email
//     const returnHtml = generateReturnRefundEmailContent(order, refundAmount, gstDeduction);
//     const returnMailOptions = {
//       from: `"Your Store" <${process.env.EMAIL_USER}>`,
//       to: order.shipping.email,
//       subject: `Order #${order._id} Return and Refund Confirmation`,
//       html: returnHtml,
//     };

//     await transporter.sendMail(returnMailOptions);
//     console.log('Return refund confirmation email sent to:', order.shipping.email);

//     await session.commitTransaction();
//     session.endSession();

//     res.json({
//       message: `Return confirmed successfully. ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} refunded to wallet after GST deduction.`,
//       netRefunded,
//       gstDeduction,
//     });
//   } catch (err) {
//     console.error('Return confirmation error:', err.message, err.stack);
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ error: err.message || 'Failed to confirm return' });
//   }
// });

// module.exports = router;

















const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const Wallet = require('../models/Wallet');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

// Normalize image URL for backend
const normalizeImageUrl = (imageUrl) => {
  const defaultPlaceholder = 'Uploads/placeholder.jpg';
  if (!imageUrl) return defaultPlaceholder;
  const normalized = imageUrl
    .replace(/^http:\/\/localhost:5000/, '')
    .replace(/^\/?[Uu]ploads\//, 'Uploads/');
  return normalized.startsWith('Uploads/') ? normalized : defaultPlaceholder;
};

// Email Template for Order Confirmation
const generateOrderEmailContent = (orderData) => {
  const { items, formData, subtotal, gstAmount, promoApplied, validPromoDiscount, walletAmountUsed, baseTotal, totalAmount, promoCodes } = orderData;
  const productNames = items.map((i) => i.name).join(', ');
  const defaultPlaceholder = 'Uploads/placeholder.jpg';
  const API_BASE = process.env.API_BASE || 'http://localhost:5000';

  const itemsHtml = items
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

      console.log(`Processing image for ${item.name}:`, {
        imageUrl,
        imagePath,
        exists: fs.existsSync(imagePath),
        finalImageUrl,
        fallbackUrl,
        cid,
      });

      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <img src="cid:${cid}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.src='${fallbackUrl}'" />
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${(item.quantity * item.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
      `;
    })
    .join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #28a745; text-align: center;">Order Confirmation</h2>
      <p style="color: #333; text-align: center;">Thank you for your purchase, ${formData.name || 'Customer'}!</p>
      <p style="color: #555; text-align: center;">Your order for ${productNames} has been successfully placed.</p>

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
          <td style="padding: 5px; text-align: right;">${subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">GST (18%)</td>
          <td style="padding: 5px; text-align: right;">${gstAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
        ${
          promoApplied
            ? `
              <tr style="color: #28a745;">
                <td style="padding: 5px;">Promo Discount (${promoCodes[promoApplied].label})</td>
                <td style="padding: 5px; text-align: right;">-${validPromoDiscount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
              </tr>
            `
            : ''
        }
        ${
          walletAmountUsed > 0
            ? `
              <tr style="color: #28a745;">
                <td style="padding: 5px;">Wallet Payment</td>
                <td style="padding: 5px; text-align: right;">-${walletAmountUsed.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
              </tr>
            `
            : ''
        }
        <tr>
          <td style="padding: 5px;">Total (Before Payments)</td>
          <td style="padding: 5px; text-align: right;">${baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
        <tr style="font-weight: bold; color: #333;">
          <td style="padding: 5px;">${formData.paymentMethod} Payment</td>
          <td style="padding: 5px; text-align: right;">${totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
      </table>

      <h3 style="color: #333; margin-top: 20px;">Shipping Information</h3>
      <p style="color: #555;">
        <strong>Name:</strong> ${formData.name || 'N/A'}<br />
        <strong>Address:</strong> ${formData.address || 'N/A'}, ${formData.city || 'N/A'}, ${formData.postalCode || 'N/A'}<br />
        <strong>Phone:</strong> ${formData.phone || 'N/A'}<br />
        <strong>Email:</strong> ${formData.email || 'N/A'}
      </p>

      <h3 style="color: #333; margin-top: 20px;">Payment Method</h3>
      <p style="color: #555;"><strong>Method:</strong> ${formData.paymentMethod}${formData.upiProvider ? ` (${formData.upiProvider})` : ''}${walletAmountUsed > 0 ? ' + Wallet' : ''}</p>

      <p style="color: #555; text-align: center; margin-top: 20px;">
        We'll notify you when your order ships. Contact us at support@example.com.
      </p>
      <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
    </div>
  `;

  return { html: htmlContent, items };
};

// Email Template for Cancellation Confirmation
const generateCancelEmailContent = (order, refundAmount, gstDeduction) => {
  const productNames = order.items.map((item) => item.name).join(', ');
  const netRefunded = refundAmount - gstDeduction;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #dc2626; text-align: center;">Order Cancellation Confirmation</h2>
      <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
      <p style="color: #555; text-align: center;">Your order #${order._id} for ${productNames} has been cancelled.</p>

      <h3 style="color: #333; margin-top: 20px;">Refund Details</h3>
      <table style="width: 100%; color: #555;">
        <tr>
          <td style="padding: 5px;">Order Total</td>
          <td style="padding: 5px; text-align: right;">${order.totals.baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">GST Deduction (18%)</td>
          <td style="padding: 5px; text-align: right;">-${gstDeduction.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
        <tr style="font-weight: bold; color: #333;">
          <td style="padding: 5px;">Refunded to Wallet</td>
          <td style="padding: 5px; text-align: right;">${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
      </table>

      <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
      <p style="color: #555;">Items: ${productNames}</p>
      <p style="color: #555;">Status: Cancelled</p>

      <p style="color: #555; text-align: center; margin-top: 20px;">
        The refund of ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} has been credited to your wallet after deducting the GST fee. Contact us at support@example.com for any queries.
      </p>
      <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
    </div>
  `;

  return htmlContent;
};

// Email Template for Return Request Confirmation
const generateReturnEmailContent = (order, returnReason, returnDetails) => {
  const productNames = order.items.map((item) => item.name).join(', ');
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #ff9800; text-align: center;">Return Request Confirmation</h2>
      <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
      <p style="color: #555; text-align: center;">Your return request for order #${order._id} for ${productNames} has been received.</p>

      <h3 style="color: #333; margin-top: 20px;">Return Details</h3>
      <p style="color: #555;">
        <strong>Reason:</strong> ${returnReason}<br />
        <strong>Additional Details:</strong> ${returnDetails || 'None provided'}
      </p>

      <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
      <p style="color: #555;">Items: ${productNames}</p>
      <p style="color: #555;">Status: Return Requested</p>

      <p style="color: #555; text-align: center; margin-top: 20px;">
        Please return the items within 7 days to our warehouse at: 123 Commerce Street, City, Country, ZIP 12345. Your refund will be processed after we receive and verify the returned items. Contact us at support@example.com for return instructions or queries.
      </p>
      <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
    </div>
  `;

  return htmlContent;
};

// Email Template for Return Refund Confirmation
const generateReturnRefundEmailContent = (order, refundAmount, gstDeduction) => {
  const productNames = order.items.map((item) => item.name).join(', ');
  const netRefunded = refundAmount - gstDeduction;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #28a745; text-align: center;">Return and Refund Confirmation</h2>
      <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
      <p style="color: #555; text-align: center;">Your return for order #${order._id} for ${productNames} has been received and processed.</p>

      <h3 style="color: #333; margin-top: 20px;">Refund Details</h3>
      <table style="width: 100%; color: #555;">
        <tr>
          <td style="padding: 5px;">Order Total</td>
          <td style="padding: 5px; text-align: right;">${order.totals.baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">GST Deduction (18%)</td>
          <td style="padding: 5px; text-align: right;">-${gstDeduction.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
        <tr style="font-weight: bold; color: #333;">
          <td style="padding: 5px;">Refunded to Wallet</td>
          <td style="padding: 5px; text-align: right;">${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
      </table>

      <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
      <p style="color: #555;">Items: ${productNames}</p>
      <p style="color: #555;">Status: Returned</p>

      <p style="color: #555; text-align: center; margin-top: 20px;">
        The refund of ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} has been credited to your wallet after deducting the GST fee. Contact us at support@example.com for any queries.
      </p>
      <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
    </div>
  `;

  return htmlContent;
};

// Email Template for Delivered Refund Confirmation
const generateDeliveredRefundEmailContent = (order, refundAmount, gstDeduction) => {
  const productNames = order.items.map((item) => item.name).join(', ');
  const netRefunded = refundAmount - gstDeduction;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #28a745; text-align: center;">Order Delivered and Refund Confirmation</h2>
      <p style="color: #333; text-align: center;">Dear ${order.shipping.name || 'Customer'},</p>
      <p style="color: #555; text-align: center;">Your order #${order._id} for ${productNames} has been marked as delivered and refunded.</p>

      <h3 style="color: #333; margin-top: 20px;">Refund Details</h3>
      <table style="width: 100%; color: #555;">
        <tr>
          <td style="padding: 5px;">Order Total</td>
          <td style="padding: 5px; text-align: right;">${order.totals.baseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
        <tr>
          <td style="padding: 5px;">GST Deduction (18%)</td>
          <td style="padding: 5px; text-align: right;">-${gstDeduction.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
        <tr style="font-weight: bold; color: #333;">
          <td style="padding: 5px;">Refunded to Wallet</td>
          <td style="padding: 5px; text-align: right;">${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
        </tr>
      </table>

      <h3 style="color: #333; margin-top: 20px;">Order Summary</h3>
      <p style="color: #555;">Items: ${productNames}</p>
      <p style="color: #555;">Status: Delivered and Refunded</p>

      <p style="color: #555; text-align: center; margin-top: 20px;">
        The refund of ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} has been credited to your wallet after deducting the GST fee. Contact us at support@example.com for any queries.
      </p>
      <p style="color: #333; text-align: center; font-weight: bold;">Thank you for shopping with us!</p>
    </div>
  `;

  return htmlContent;
};

// POST /api/orders/send-confirmation
router.post('/send-confirmation', authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      items,
      formData,
      subtotal,
      gstAmount,
      promoApplied,
      validPromoDiscount,
      walletAmountUsed,
      baseTotal,
      totalAmount,
      promoCodes,
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!items || !items.length) missingFields.push('items');
    if (!formData) missingFields.push('formData');
    else {
      if (!formData.email) missingFields.push('formData.email');
      if (!formData.name) missingFields.push('formData.name');
      if (!formData.phone) missingFields.push('formData.phone');
      if (!formData.address) missingFields.push('formData.address');
      if (!formData.city) missingFields.push('formData.city');
      if (!formData.postalCode) missingFields.push('formData.postalCode');
      if (!formData.paymentMethod) missingFields.push('formData.paymentMethod');
    }
    if (subtotal === undefined || subtotal < 0) missingFields.push('subtotal');
    if (gstAmount === undefined || gstAmount < 0) missingFields.push('gstAmount');
    if (baseTotal === undefined || baseTotal < 0) missingFields.push('baseTotal');
    if (totalAmount === undefined || totalAmount < 0) missingFields.push('totalAmount');

    if (missingFields.length > 0) {
      console.error('Invalid order data:', {
        missingFields,
        itemsCount: items?.length,
        formData: formData || 'undefined',
        subtotal,
        gstAmount,
        baseTotal,
        totalAmount,
        walletAmountUsed,
      });
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: `Missing required order data: ${missingFields.join(', ')}` });
    }

    // Verify email matches authenticated user
    if (formData.email !== req.user.email) {
      console.warn('Email mismatch:', formData.email, 'vs', req.user.email);
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ error: 'Email does not match authenticated user' });
    }

    // Validate items have _id, name, price, quantity, and valid ObjectId
    const invalidItems = items.filter(
      (item) => !item._id || !ObjectId.isValid(item._id) || !item.name || !item.price || !item.quantity
    );
    if (invalidItems.length > 0) {
      console.error('Invalid items:', invalidItems.map((i) => ({
        _id: i._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        isValidObjectId: i._id ? ObjectId.isValid(i._id) : false,
      })));
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'All items must have a valid ObjectId _id, name, price, and quantity' });
    }

    // Log incoming items for debugging
    console.log('Received items:', items.map((item) => ({
      _id: item._id,
      name: item.name,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
    })));

    // Validate and update stock
    const productIds = items.map((item) => new ObjectId(item._id));
    const products = await Product.find({ _id: { $in: productIds } }).session(session);

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item._id);
      if (!product) {
        console.error(`Product not found for ID: ${item._id}, Name: ${item.name}`);
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: `Product not found: ${item.name} (ID: ${item._id})` });
      }
      if (product.stock < item.quantity) {
        console.error(`Insufficient stock for ${item.name}:`, { available: product.stock, requested: item.quantity });
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: `Insufficient stock for ${item.name}: only ${product.stock} available` });
      }
      product.stock -= item.quantity;
      await product.save({ session });
      console.log(`Updated stock for ${product.name}:`, { newStock: product.stock });
    }

    // Handle wallet payment
    if (walletAmountUsed > 0) {
      const wallet = await Wallet.findOne({ userId: req.user.id }).session(session);
      if (!wallet) {
        console.error('Wallet not found for user:', req.user.id);
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: 'Wallet not found' });
      }
      if (wallet.balance < walletAmountUsed) {
        console.error('Insufficient wallet balance:', { balance: wallet.balance, requested: walletAmountUsed });
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: `Insufficient wallet balance: ${wallet.balance} < ${walletAmountUsed}` });
      }

      // Deduct wallet balance
      wallet.balance -= walletAmountUsed;
      wallet.transactions.push({
        type: 'debit',
        amount: walletAmountUsed,
        description: `Order payment for ${items.map((i) => i.name).join(', ')}`,
        createdAt: new Date(),
      });
      await wallet.save({ session });
      console.log('Wallet updated:', { userId: req.user.id, newBalance: wallet.balance });

      // Log transaction
      await Transaction.create(
        [{
          userId: req.user.id,
          orderId: null, // Order ID not yet available
          type: 'debit',
          amount: walletAmountUsed,
          description: `Wallet payment for order`,
          createdAt: new Date(),
        }],
        { session }
      );
    }

    // Save order to MongoDB
    const order = new Order({
      userId: req.user.id,
      items: items.map((item) => ({
        _id: new ObjectId(item._id),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: normalizeImageUrl(item.imageUrl),
      })),
      shipping: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        userId: req.user.id,
      },
      payment: {
        method: formData.paymentMethod,
        upiId: formData.upiId || '',
        cardLastFour: formData.cardNumber ? formData.cardNumber.slice(-4) : '',
        upiProvider: formData.upiProvider || '',
      },
      totals: {
        subtotal,
        gstAmount,
        promoDiscount: validPromoDiscount || 0,
        walletAmountUsed: walletAmountUsed || 0,
        baseTotal,
        totalAmount,
        promoCode: promoApplied || '',
      },
      deliveredAt: null, // Initialize deliveredAt
    });

    const savedOrder = await order.save({ session });
    console.log('Order saved:', { id: savedOrder._id, email: savedOrder.shipping.email, userId: savedOrder.shipping.userId });

    // Update transaction with order ID
    if (walletAmountUsed > 0) {
      await Transaction.updateMany(
        { userId: req.user.id, orderId: null, type: 'debit', amount: walletAmountUsed },
        { orderId: savedOrder._id },
        { session }
      );
    }

    // Create notification with image and total price
    const productNames = items.map((item) => item.name).join(', ');
    const notification = new Notification({
      userId: req.user.id,
      message: `Order placed successfully for: ${productNames}`,
      imageUrl: normalizeImageUrl(items[0]?.imageUrl),
      totalPrice: baseTotal,
      isRead: false
    });
    await notification.save({ session });
    console.log('Notification created:', {
      userId: req.user.id,
      message: notification.message,
      imageUrl: notification.imageUrl,
      totalPrice: notification.totalPrice,
    });

    // Prepare email attachments
    const { html, items: emailItems } = generateOrderEmailContent(req.body);
    const defaultPlaceholder = 'Uploads/placeholder.jpg';
    const defaultPlaceholderPath = path.join(__dirname, '..', 'public', defaultPlaceholder);

    // Log if default placeholder is missing
    if (!fs.existsSync(defaultPlaceholderPath)) {
      console.warn(`Default placeholder not found: ${defaultPlaceholderPath}`);
    }

    const attachments = emailItems
      .map((item, index) => {
        let imageUrl = normalizeImageUrl(item.imageUrl);
        let imagePath = path.join(__dirname, '..', 'public', imageUrl);

        if (!fs.existsSync(imagePath)) {
          console.warn(`Image file not found for ${item.name}: ${imagePath}, using default placeholder`);
          imagePath = defaultPlaceholderPath;
          imageUrl = defaultPlaceholder;
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

    console.log('Email attachments:', attachments.map((a) => ({ filename: a.filename, path: a.path, cid: a.cid })));

    // Send confirmation email
    const mailOptions = {
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to: formData.email,
      subject: `Order Confirmation #${savedOrder._id}`,
      html,
      attachments,
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', formData.email);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      productNames,
      orderId: savedOrder._id,
      message: 'Order processed, notification created, and email sent',
    });
  } catch (error) {
    console.error('Error processing order:', error.message, error.stack);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message || 'Failed to process order' });
  }
});

// Get all orders (admins get all, users get their own)
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching orders for:', { email: req.user.email, userId: req.user.id, role: req.user.role });
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find({});
    } else {
      orders = await Order.find({
        $or: [{ 'shipping.email': req.user.email }, { 'shipping.userId': req.user.id }],
      });
    }
    console.log('Fetched orders:', orders.length, 'for user:', req.user.email);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (
      req.user.role !== 'admin' &&
      order.shipping.email !== req.user.email &&
      String(order.shipping.userId) !== req.user.id
    ) {
      console.warn('Unauthorized access:', {
        orderEmail: order.shipping.email,
        orderUserId: order.shipping.userId,
        user: req.user,
      });
      return res.status(403).json({ error: 'Unauthorized access to order' });
    }
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err.message);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (e.g., to Delivered)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;
    console.log('Status update request:', { orderId: req.params.id, status, user: req.user });

    // Validate status
    if (!['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'].includes(status)) {
      console.error('Invalid status provided:', status);
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Fetch order
    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      console.error('Order not found:', req.params.id);
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Order not found' });
    }
    console.log('Order found:', { orderId: order._id, currentStatus: order.status, email: order.shipping.email });

    // Check admin permissions
    if (req.user.role !== 'admin') {
      console.warn('Unauthorized status update:', {
        orderEmail: order.shipping.email,
        orderUserId: order.shipping.userId,
        user: req.user,
      });
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ error: 'Only admins can update order status' });
    }

    // Prevent status change for cancelled or returned orders
    if (order.status === 'Cancelled' || order.status === 'Returned') {
      console.error('Cannot change status:', { orderId: order._id, currentStatus: order.status, attemptedStatus: status });
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: `Cannot change status of ${order.status.toLowerCase()} order` });
    }

    // Update order status
    order.status = status;
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      console.log('Setting deliveredAt:', order.deliveredAt);

      // Process refund for Delivered status
      const refundAmount = order.totals.baseTotal;
      const gstDeduction = refundAmount * 0.18;
      const netRefunded = refundAmount - gstDeduction;

      // Validate refundAmount and gstDeduction
      const expectedGstDeduction = order.totals.baseTotal * 0.18;
      if (refundAmount !== order.totals.baseTotal || Math.abs(gstDeduction - expectedGstDeduction) > 0.01) {
        console.error('Invalid refund data:', {
          refundAmount,
          expectedRefund: order.totals.baseTotal,
          gstDeduction,
          expectedGstDeduction,
        });
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: 'Invalid refund amount or GST deduction' });
      }

      // Restore stock
      const productIds = order.items.map((item) => new ObjectId(item._id));
      const products = await Product.find({ _id: { $in: productIds } }).session(session);

      for (const item of order.items) {
        const product = products.find((p) => p._id.toString() === item._id.toString());
        if (!product) {
          console.error(`Product not found for stock restoration: ${item._id}`);
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({ error: `Product not found: ${item.name}` });
        }
        product.stock += item.quantity;
        await product.save({ session });
        console.log(`Restored stock for ${product.name}:`, { newStock: product.stock });
      }

      // Credit wallet with refundAmount minus gstDeduction
      const wallet = await Wallet.findOne({ userId: order.shipping.userId }).session(session);
      if (!wallet) {
        console.error('Wallet not found for user:', order.shipping.userId);
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: 'Wallet not found' });
      }

      wallet.balance += netRefunded;
      wallet.transactions.push({
        type: 'credit',
        amount: netRefunded,
        description: `Refund for delivered order #${order._id} after GST deduction`,
        createdAt: new Date(),
      });
      await wallet.save({ session });
      console.log('Wallet credited:', { userId: order.shipping.userId, netRefunded, newBalance: wallet.balance });

      // Log transaction with GST deduction
      await Transaction.create(
        [{
          userId: order.shipping.userId,
          orderId: order._id,
          type: 'refund',
          amount: netRefunded,
          gstDeduction,
          description: `Refund for delivered order #${order._id} with GST fee`,
          createdAt: new Date(),
        }],
        { session }
      );

      // Create notification for refund
      const productNames = order.items.map((item) => item.name).join(', ');
      const refundNotification = new Notification({
        userId: order.shipping.userId,
        message: `Order #${order._id} marked as delivered. ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} refunded to your wallet after GST deduction.`,
        imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
        totalPrice: order.totals.baseTotal,
        isRead: false,
      });
      await refundNotification.save({ session });
      console.log('Refund notification created:', {
        userId: order.shipping.userId,
        message: refundNotification.message,
        imageUrl: refundNotification.imageUrl,
        totalPrice: refundNotification.totalPrice,
      });

      // Send refund confirmation email
      const refundHtml = generateDeliveredRefundEmailContent(order, refundAmount, gstDeduction);
      const refundMailOptions = {
        from: `"Your Store" <${process.env.EMAIL_USER}>`,
        to: order.shipping.email,
        subject: `Order #${order._id} Delivered and Refund Confirmation`,
        html: refundHtml,
      };

      await transporter.sendMail(refundMailOptions);
      console.log('Refund confirmation email sent to:', order.shipping.email);

      // Create delivery notification
      const deliveryNotification = new Notification({
        userId: order.shipping.userId,
        message: `Order #${order._id} for ${productNames} has been delivered`,
        imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
        totalPrice: order.totals.baseTotal,
        isRead: false,
      });
      await deliveryNotification.save({ session });
      console.log('Delivery notification created:', {
        userId: order.shipping.userId,
        message: deliveryNotification.message,
        imageUrl: deliveryNotification.imageUrl,
        totalPrice: deliveryNotification.totalPrice,
      });
    }

    await order.save({ session });
    console.log(`Order ${req.params.id} status updated to ${status} by admin: ${req.user.email}`);

    await session.commitTransaction();
    session.endSession();

    res.json({ 
      message: `Order status updated to ${status}${status === 'Delivered' ? ' and refunded' : ''}`,
      netRefunded: status === 'Delivered' ? netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : undefined,
      gstDeduction: status === 'Delivered' ? gstDeduction.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : undefined,
    });
  } catch (err) {
    console.error('Status update error:', err.message, err.stack);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message || 'Failed to update order status' });
  }
});

// Cancel order
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { refundAmount, gstDeduction } = req.body;
    console.log('Cancellation request:', { orderId: req.params.id, refundAmount, gstDeduction, user: req.user.email });

    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Order not found' });
    }
    if (
      req.user.role !== 'admin' &&
      order.shipping.email !== req.user.email &&
      String(order.shipping.userId) !== req.user.id
    ) {
      console.warn('Unauthorized cancel:', {
        orderEmail: order.shipping.email,
        orderUserId: order.shipping.userId,
        user: req.user,
      });
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ error: 'Unauthorized to cancel this order' });
    }
    if (order.status === 'Cancelled') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Order is already cancelled' });
    }
    if (order.status === 'Shipped' || order.status === 'Delivered') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Cannot cancel shipped or delivered order' });
    }

    // Validate refundAmount and gstDeduction
    const expectedGstDeduction = order.totals.baseTotal * 0.18;
    if (refundAmount !== order.totals.baseTotal || Math.abs(gstDeduction - expectedGstDeduction) > 0.01) {
      console.error('Invalid refund data:', {
        refundAmount,
        expectedRefund: order.totals.baseTotal,
        gstDeduction,
        expectedGstDeduction,
      });
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Invalid refund amount or GST deduction' });
    }

    // Restore stock
    const productIds = order.items.map((item) => new ObjectId(item._id));
    const products = await Product.find({ _id: { $in: productIds } }).session(session);

    for (const item of order.items) {
      const product = products.find((p) => p._id.toString() === item._id.toString());
      if (!product) {
        console.error(`Product not found for stock restoration: ${item._id}`);
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: `Product not found: ${item.name}` });
      }
      product.stock += item.quantity;
      await product.save({ session });
      console.log(`Restored stock for ${product.name}:`, { newStock: product.stock });
    }

    // Credit wallet with refundAmount minus gstDeduction
    const wallet = await Wallet.findOne({ userId: order.shipping.userId }).session(session);
    if (!wallet) {
      console.error('Wallet not found for user:', order.shipping.userId);
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Wallet not found' });
    }

    const netRefunded = refundAmount - gstDeduction;
    wallet.balance += netRefunded;
    wallet.transactions.push({
      type: 'credit',
      amount: netRefunded,
      description: `Refund for cancelled order #${order._id} after GST deduction`,
      createdAt: new Date(),
    });
    await wallet.save({ session });
    console.log('Wallet credited:', { userId: order.shipping.userId, netRefunded, newBalance: wallet.balance });

    // Log transaction with GST deduction
    await Transaction.create(
      [{
        userId: order.shipping.userId,
        orderId: order._id,
        type: 'refund',
        amount: netRefunded,
        gstDeduction,
        description: `Refund for cancelled order #${order._id} with GST fee`,
        createdAt: new Date(),
      }],
      { session }
    );

    // Create notification for refund
    const productNames = order.items.map((item) => item.name).join(', ');
    const notification = new Notification({
      userId: order.shipping.userId,
      message: `Order #${order._id} cancelled. ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} refunded to your wallet after GST deduction.`,
      imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
      totalPrice: order.totals.baseTotal,
      isRead: false,
    });
    await notification.save({ session });
    console.log('Refund notification created:', {
      userId: order.shipping.userId,
      message: notification.message,
      imageUrl: notification.imageUrl,
      totalPrice: notification.totalPrice,
    });

    // Update order status
    order.status = 'Cancelled';
    await order.save({ session });
    console.log(`Order ${req.params.id} cancelled by user: ${req.user.email}`);

    // Send cancellation confirmation email
    const cancelHtml = generateCancelEmailContent(order, refundAmount, gstDeduction);
    const cancelMailOptions = {
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to: order.shipping.email,
      subject: `Order #${order._id} Cancellation Confirmation`,
      html: cancelHtml,
    };

    await transporter.sendMail(cancelMailOptions);
    console.log('Cancellation confirmation email sent to:', order.shipping.email);

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: `Order cancelled successfully. ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} refunded to your wallet after GST deduction.`,
      netRefunded,
      gstDeduction,
    });
  } catch (err) {
    console.error('Cancel order error:', err.message, err.stack);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message || 'Failed to cancel order' });
  }
});

// Request return for an order
router.patch('/:id/return/request', authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { returnReason, returnDetails } = req.body;
    console.log('Return request:', { orderId: req.params.id, returnReason, returnDetails, user: req.user.email });

    // Validate returnReason
    if (!returnReason) {
      console.error('Missing return reason');
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Return reason is required' });
    }

    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Order not found' });
    }
    if (
      req.user.role !== 'admin' &&
      order.shipping.email !== req.user.email &&
      String(order.shipping.userId) !== req.user.id
    ) {
      console.warn('Unauthorized return:', {
        orderEmail: order.shipping.email,
        orderUserId: order.shipping.userId,
        user: req.user,
      });
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ error: 'Unauthorized to return this order' });
    }
    if (order.status !== 'Delivered') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Only delivered orders can be returned' });
    }
    if (order.status === 'Return Requested') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Return already requested for this order' });
    }
    if (order.status === 'Returned') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Order has already been returned' });
    }

    // Check return eligibility (within 5 days of delivery)
    const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.createdAt);
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    if (currentDate - deliveryDate > fiveDaysInMs) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Return period has expired (5 days from delivery)' });
    }

    // Update order status and store return details
    order.status = 'Return Requested';
    order.returnDetails = { reason: returnReason, details: returnDetails || '' };
    await order.save({ session });
    console.log(`Return requested for order ${req.params.id} by user: ${req.user.email}`, { returnReason, returnDetails });

    // Create notification for return request
    const productNames = order.items.map((item) => item.name).join(', ');
    const notification = new Notification({
      userId: order.shipping.userId,
      message: `Return requested for order #${order._id} for ${productNames}. Awaiting admin confirmation.`,
      imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
      totalPrice: order.totals.baseTotal,
      isRead: false,
    });
    await notification.save({ session });
    console.log('Return request notification created:', {
      userId: order.shipping.userId,
      message: notification.message,
      imageUrl: notification.imageUrl,
      totalPrice: notification.totalPrice,
    });

    // Send return request confirmation email
    const returnHtml = generateReturnEmailContent(order, returnReason, returnDetails);
    const returnMailOptions = {
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to: order.shipping.email,
      subject: `Order #${order._id} Return Request Confirmation`,
      html: returnHtml,
    };

    await transporter.sendMail(returnMailOptions);
    console.log('Return request confirmation email sent to:', order.shipping.email);

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: `Return requested successfully. Awaiting admin confirmation.`,
    });
  } catch (err) {
    console.error('Return request error:', err.message, err.stack);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message || 'Failed to request return' });
  }
});

// Confirm return for an order (Admin only)
router.patch('/:id/return/confirm', authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { refundAmount, gstDeduction } = req.body;
    console.log('Return confirmation request:', { orderId: req.params.id, refundAmount, gstDeduction, user: req.user.email });

    // Check admin permissions
    if (req.user.role !== 'admin') {
      console.warn('Unauthorized return confirmation:', { user: req.user });
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ error: 'Only admins can confirm returns' });
    }

    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.status !== 'Return Requested') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Order is not in Return Requested status' });
    }

    // Validate refundAmount and gstDeduction
    const expectedGstDeduction = order.totals.baseTotal * 0.18;
    if (refundAmount !== order.totals.baseTotal || Math.abs(gstDeduction - expectedGstDeduction) > 0.01) {
      console.error('Invalid refund data:', {
        refundAmount,
        expectedRefund: order.totals.baseTotal,
        gstDeduction,
        expectedGstDeduction,
      });
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Invalid refund amount or GST deduction' });
    }

    // Restore stock
    const productIds = order.items.map((item) => new ObjectId(item._id));
    const products = await Product.find({ _id: { $in: productIds } }).session(session);

    for (const item of order.items) {
      const product = products.find((p) => p._id.toString() === item._id.toString());
      if (!product) {
        console.error(`Product not found for stock restoration: ${item._id}`);
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: `Product not found: ${item.name}` });
      }
      product.stock += item.quantity;
      await product.save({ session });
      console.log(`Restored stock for ${product.name}:`, { newStock: product.stock });
    }

    // Credit wallet with refundAmount minus gstDeduction
    const wallet = await Wallet.findOne({ userId: order.shipping.userId }).session(session);
    if (!wallet) {
      console.error('Wallet not found for user:', order.shipping.userId);
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Wallet not found' });
    }

    const netRefunded = refundAmount - gstDeduction;
    wallet.balance += netRefunded;
    wallet.transactions.push({
      type: 'credit',
      amount: netRefunded,
      description: `Refund for returned order #${order._id} after GST deduction`,
      createdAt: new Date(),
    });
    await wallet.save({ session });
    console.log('Wallet credited:', { userId: order.shipping.userId, netRefunded, newBalance: wallet.balance });

    // Log transaction with GST deduction
    await Transaction.create(
      [{
        userId: order.shipping.userId,
        orderId: order._id,
        type: 'refund',
        amount: netRefunded,
        gstDeduction,
        description: `Refund for returned order #${order._id} with GST fee`,
        createdAt: new Date(),
      }],
      { session }
    );

    // Create notification for return confirmation
    const productNames = order.items.map((item) => item.name).join(', ');
    const notification = new Notification({
      userId: order.shipping.userId,
      message: `Return for order #${order._id} confirmed. ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} refunded to your wallet after GST deduction.`,
      imageUrl: normalizeImageUrl(order.items[0]?.imageUrl),
      totalPrice: order.totals.baseTotal,
      isRead: false,
    });
    await notification.save({ session });
    console.log('Return confirmation notification created:', {
      userId: order.shipping.userId,
      message: notification.message,
      imageUrl: notification.imageUrl,
      totalPrice: notification.totalPrice,
    });

    // Update order status and store refund details
    order.status = 'Returned';
    order.refundedAmount = netRefunded;
    await order.save({ session });
    console.log(`Return confirmed for order ${req.params.id} by admin: ${req.user.email}`);

    // Send return refund confirmation email
    const returnHtml = generateReturnRefundEmailContent(order, refundAmount, gstDeduction);
    const returnMailOptions = {
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to: order.shipping.email,
      subject: `Order #${order._id} Return and Refund Confirmation`,
      html: returnHtml,
    };

    await transporter.sendMail(returnMailOptions);
    console.log('Return refund confirmation email sent to:', order.shipping.email);

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: `Return confirmed successfully. ${netRefunded.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} refunded to wallet after GST deduction.`,
      netRefunded,
      gstDeduction,
    });
  } catch (err) {
    console.error('Return confirmation error:', err.message, err.stack);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message || 'Failed to confirm return' });
  }
});

module.exports = router;