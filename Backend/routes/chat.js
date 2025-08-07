






// const express = require('express');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const Notification = require('../models/Notification');
// const User = require('../models/User');
// const Chat = require('../models/Chat');

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

// // POST /api/chat - Send a new chat message (user)
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { content } = req.body;
//     if (!content) {
//       return res.status(400).json({ error: 'Message content is required' });
//     }

//     // Find an admin to receive the message
//     const admin = await User.findOne({ role: 'admin' });
//     if (!admin) {
//       return res.status(500).json({ error: 'No admin available to receive message' });
//     }

//     // Save chat message
//     const chat = new Chat({
//       sender: req.user.id,
//       receiver: admin._id,
//       content,
//       role: 'user',
//       isRead: false,
//     });
//     const savedChat = await chat.save();
//     console.log('Chat saved:', {
//       id: savedChat._id,
//       sender: req.user.email,
//       receiver: admin.email,
//       content,
//     });

//     // Create notification for admin
//     const notification = new Notification({
//       userId: admin._id,
//       message: `New message from ${req.user.name || 'User'}: ${content.substring(0, 50)}...`,
//       imageUrl: 'https://img.icons8.com/windows/100/chat-message-sent.png',
//       type: 'chat',
//       isRead: false,
//       createdAt: new Date(),
//     });
//     await notification.save();
//     console.log('Notification created:', {
//       userId: admin._id,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       type: 'chat',
//     });

//     // Send email to admin
//     const mailOptions = {
//       from: `"Express.com Support" <${process.env.EMAIL_USER}>`,
//       to: admin.email,
//       subject: 'New Customer Message on Express.com',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//           <h2 style="color: #28a745; text-align: center;">New Customer Message</h2>
//           <p style="color: #333;">Dear Admin,</p>
//           <p style="color: #555;">
//             You have received a new message from ${req.user.name || 'a customer'} (${req.user.email}).
//           </p>
//           <p style="color: #555;">Message: ${content}</p>
//           <p style="color: #555; text-align: center;">
//             <a href="http://localhost:3000/admin/chats" style="background-color: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Chats</a>
//           </p>
//           <p style="color: #333; text-align: center; font-weight: bold;">Express.com Support</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent to:', admin.email);

//     // Populate sender and receiver for response
//     const populatedChat = await Chat.findById(savedChat._id)
//       .populate('sender', '_id email name role')
//       .populate('receiver', '_id email name role');

//     res.status(201).json(populatedChat);
//   } catch (err) {
//     console.error('Error sending message:', err.message);
//     res.status(500).json({ error: 'Failed to send message' });
//   }
// });

// // GET /api/chat - Fetch user's chats
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     console.log('Fetching chats for user:', req.user.email);
//     const chats = await Chat.find({
//       $or: [{ sender: req.user.id }, { receiver: req.user.id }],
//     })
//       .populate('sender', '_id email name role')
//       .populate('receiver', '_id email name role')
//       .sort({ createdAt: 1 });
//     console.log('Fetched chats:', chats.length);
//     res.json(chats);
//   } catch (err) {
//     console.error('Error fetching chats:', err.message);
//     res.status(500).json({ error: 'Failed to fetch chats' });
//   }
// });

// // GET /api/chat/unread - Fetch count of unread messages
// router.get('/unread', authMiddleware, async (req, res) => {
//   try {
//     console.log('Fetching unread chat count for user:', req.user.email);
//     const unreadCount = await Chat.countDocuments({
//       receiver: req.user.id,
//       sender: { $ne: req.user.id },
//       isRead: false
//     });
//     console.log('Unread chat count:', unreadCount);
//     res.json({ count: unreadCount });
//   } catch (err) {
//     console.error('Error fetching unread count:', err.message);
//     res.status(500).json({ error: 'Failed to fetch unread count' });
//   }
// });

// // GET /api/chat/all - Fetch all chats for admin
// router.get('/all', authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Only admins can access all chats' });
//     }
//     console.log('Fetching all chats for admin:', req.user.email);
//     const chats = await Chat.find()
//       .populate('sender', '_id email name role')
//       .populate('receiver', '_id email name role')
//       .sort({ createdAt: 1 });
//     console.log('Fetched chats:', chats.length);
//     res.json(chats);
//   } catch (err) {
//     console.error('Error fetching chats:', err.message);
//     res.status(500).json({ error: 'Failed to fetch chats' });
//   }
// });

// // POST /api/chat/reply - Send a reply (admin only)
// router.post('/reply', authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Only admins can send replies' });
//     }

//     const { content, receiverId } = req.body;
//     if (!content || !receiverId) {
//       return res.status(400).json({ error: 'Content and receiverId are required' });
//     }

//     // Verify receiver exists
//     const receiver = await User.findById(receiverId);
//     if (!receiver) {
//       return res.status(404).json({ error: 'Receiver not found' });
//     }
//     if (receiver.role === 'admin') {
//       return res.status(400).json({ error: 'Cannot send message to another admin' });
//     }

//     // Save chat message
//     const chat = new Chat({
//       sender: req.user.id,
//       receiver: receiverId,
//       content,
//       role: 'admin',
//       isRead: false,
//     });
//     const savedChat = await chat.save();
//     console.log('Chat saved:', {
//       id: savedChat._id,
//       sender: req.user.email,
//       receiver: receiver.email,
//       content,
//     });

//     // Create notification
//     const notification = new Notification({
//       userId: receiverId,
//       message: 'You have a message from express.com, please visit FAQs and chat with an agent to resolve your query',
//       imageUrl: 'https://img.icons8.com/windows/100/chat-message-sent.png',
//       type: 'chat',
//       isRead: false,
//       createdAt: new Date(),
//     });
//     await notification.save();
//     console.log('Notification created:', {
//       userId: receiverId,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       type: 'chat',
//     });

//     // Send email
//     const mailOptions = {
//       from: `"Express.com Support" <${process.env.EMAIL_USER}>`,
//       to: receiver.email,
//       subject: 'New Message from Express.com Support',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//           <h2 style="color: #28a745; text-align: center;">New Message from Express.com</h2>
//           <p style="color: #333;">Dear ${receiver.name || 'Customer'},</p>
//           <p style="color: #555;">
//             You have received a new message from our support team. Please visit the <a href="http://localhost:3000/faqs" style="color: #28a745;">FAQs</a> or chat with an agent to resolve your query.
//           </p>
//           <p style="color: #555;">Message: ${content}</p>
//           <p style="color: #555; text-align: center;">
//             <a href="http://localhost:3000/faqs" style="background-color: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Chat Now</a>
//           </p>
//           <p style="color: #333; text-align: center; font-weight: bold;">Thank you for choosing Express.com!</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent to:', receiver.email);

//     // Populate sender and receiver for response
//     const populatedChat = await Chat.findById(savedChat._id)
//       .populate('sender', '_id email name role')
//       .populate('receiver', '_id email name role');

//     res.status(201).json(populatedChat);
//   } catch (err) {
//     console.error('Error sending reply:', err.message);
//     res.status(500).json({ error: 'Failed to send reply' });
//   }
// });

// // POST /api/chat/mark-read - Mark messages as read
// router.post('/mark-read', authMiddleware, async (req, res) => {
//   try {
//     const { userId } = req.body;
//     if (!userId) {
//       return res.status(400).json({ error: 'userId is required' });
//     }

//     console.log('Marking messages as read for receiver:', req.user.id, 'from sender:', userId);
//     const result = await Chat.updateMany(
//       { receiver: req.user.id, sender: userId, isRead: false },
//       { $set: { isRead: true } }
//     );
//     console.log('Messages marked as read:', result.modifiedCount);
//     res.json({ message: 'Messages marked as read', modifiedCount: result.modifiedCount });
//   } catch (err) {
//     console.error('Error marking messages as read:', err.message);
//     res.status(500).json({ error: 'Failed to mark messages as read' });
//   }
// });

// module.exports = router;









// const express = require('express');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const Notification = require('../models/Notification');
// const User = require('../models/User');
// const Chat = require('../models/Chat');

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

// // POST /api/chat - Send a new chat message (user)
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { content } = req.body;
//     if (!content) {
//       return res.status(400).json({ error: 'Message content is required' });
//     }

//     const admin = await User.findOne({ role: 'admin' });
//     if (!admin) {
//       return res.status(500).json({ error: 'No admin available to receive message' });
//     }

//     const chat = new Chat({
//       sender: req.user.id,
//       receiver: admin._id,
//       content,
//       role: 'user',
//       isRead: false,
//     });
//     const savedChat = await chat.save();
//     console.log('Chat saved:', {
//       id: savedChat._id,
//       sender: req.user.email,
//       receiver: admin.email,
//       content,
//     });

//     const notification = new Notification({
//       userId: admin._id,
//       message: `New message from ${req.user.name || 'User'}: ${content.substring(0, 50)}...`,
//       imageUrl: 'https://img.icons8.com/windows/100/chat-message-sent.png',
//       type: 'chat',
//       isRead: false,
//       createdAt: new Date(),
//     });
//     await notification.save();
//     console.log('Notification created:', {
//       userId: admin._id,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       type: 'chat',
//     });

//     const mailOptions = {
//       from: `"Express.com Support" <${process.env.EMAIL_USER}>`,
//       to: admin.email,
//       subject: 'New Customer Message on Express.com',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//           <h2 style="color: #28a745; text-align: center;">New Customer Message</h2>
//           <p style="color: #333;">Dear Admin,</p>
//           <p style="color: #555;">
//             You have received a new message from ${req.user.name || 'a customer'} (${req.user.email}).
//           </p>
//           <p style="color: #555;">Message: ${content}</p>
//           <p style="color: #555; text-align: center;">
//             <a href="http://localhost:3000/admin/chats" style="background-color: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Chats</a>
//           </p>
//           <p style="color: #333; text-align: center; font-weight: bold;">Express.com Support</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent to:', admin.email);

//     const populatedChat = await Chat.findById(savedChat._id)
//       .populate('sender', '_id email name role')
//       .populate('receiver', '_id email name role');

//     res.status(201).json(populatedChat);
//   } catch (err) {
//     console.error('Error sending message:', err.message);
//     res.status(500).json({ error: 'Failed to send message' });
//   }
// });

// // GET /api/chat - Fetch user's chats
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     console.log('Fetching chats for user:', req.user.email);
//     const chats = await Chat.find({
//       $or: [{ sender: req.user.id }, { receiver: req.user.id }],
//     })
//       .populate('sender', '_id email name role')
//       .populate('receiver', '_id email name role')
//       .sort({ createdAt: 1 });
//     console.log('Fetched chats:', chats.length);
//     res.json(chats);
//   } catch (err) {
//     console.error('Error fetching chats:', err.message);
//     res.status(500).json({ error: 'Failed to fetch chats' });
//   }
// });

// // GET /api/chat/unread - Fetch count of unread messages
// router.get('/unread', authMiddleware, async (req, res) => {
//   try {
//     console.log('Fetching unread chat count for user:', req.user.email);
//     const unreadCount = await Chat.countDocuments({
//       receiver: req.user.id,
//       sender: { $ne: req.user.id },
//       isRead: false
//     });
//     console.log('Unread chat count:', unreadCount);
//     res.json({ count: unreadCount });
//   } catch (err) {
//     console.error('Error fetching unread count:', err.message);
//     res.status(500).json({ error: 'Failed to fetch unread count' });
//   }
// });

// // GET /api/chat/all - Fetch all chats for admin
// router.get('/all', authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Only admins can access all chats' });
//     }
//     console.log('Fetching all chats for admin:', req.user.email);
//     const chats = await Chat.find()
//       .populate('sender', '_id email name role')
//       .populate('receiver', '_id email name role')
//       .sort({ createdAt: 1 });
//     console.log('Fetched chats:', chats.length);
//     res.json(chats);
//   } catch (err) {
//     console.error('Error fetching chats:', err.message);
//     res.status(500).json({ error: 'Failed to fetch chats' });
//   }
// });

// // POST /api/chat/reply - Send a reply (admin only)
// router.post('/reply', authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Only admins can send replies' });
//     }

//     const { content, receiverId } = req.body;
//     if (!content || !receiverId) {
//       return res.status(400).json({ error: 'Content and receiverId are required' });
//     }

//     const receiver = await User.findById(receiverId);
//     if (!receiver) {
//       return res.status(404).json({ error: 'Receiver not found' });
//     }
//     if (receiver.role === 'admin') {
//       return res.status(400).json({ error: 'Cannot send message to another admin' });
//     }

//     const chat = new Chat({
//       sender: req.user.id,
//       receiver: receiverId,
//       content,
//       role: 'admin',
//       isRead: false,
//     });
//     const savedChat = await chat.save();
//     console.log('Chat saved:', {
//       id: savedChat._id,
//       sender: req.user.email,
//       receiver: receiver.email,
//       content,
//     });

//     const notification = new Notification({
//       userId: receiverId,
//       message: 'You have a message from Express.com, please visit FAQs and chat with an agent to resolve your query',
//       imageUrl: 'https://img.icons8.com/windows/100/chat-message-sent.png',
//       type: 'chat',
//       isRead: false,
//       createdAt: new Date(),
//     });
//     await notification.save();
//     console.log('Notification created:', {
//       userId: receiverId,
//       message: notification.message,
//       imageUrl: notification.imageUrl,
//       type: 'chat',
//     });

//     const mailOptions = {
//       from: `"Express.com Support" <${process.env.EMAIL_USER}>`,
//       to: receiver.email,
//       subject: 'New Message from Express.com Support',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
//           <h2 style="color: #28a745; text-align: center;">New Message from Express.com</h2>
//           <p style="color: #333;">Dear ${receiver.name || 'Customer'},</p>
//           <p style="color: #555;">
//             You have received a new message from our support team. Please visit the <a href="http://localhost:3000/faqs" style="color: #28a745;">FAQs</a> or chat with an agent to resolve your query.
//           </p>
//           <p style="color: #555;">Message: ${content}</p>
//           <p style="color: #555; text-align: center;">
//             <a href="http://localhost:3000/faqs" style="background-color: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Chat Now</a>
//           </p>
//           <p style="color: #333; text-align: center; font-weight: bold;">Thank you for choosing Express.com!</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent to:', receiver.email);

//     const populatedChat = await Chat.findById(savedChat._id)
//       .populate('sender', '_id email name role')
//       .populate('receiver', '_id email name role');

//     res.status(201).json(populatedChat);
//   } catch (err) {
//     console.error('Error sending reply:', err.message);
//     res.status(500).json({ error: 'Failed to send reply' });
//   }
// });

// // POST /api/chat/mark-read - Mark messages as read
// router.post('/mark-read', authMiddleware, async (req, res) => {
//   try {
//     const { userId } = req.body;
//     if (!userId) {
//       return res.status(400).json({ error: 'userId is required' });
//     }

//     console.log('Marking messages as read for receiver:', req.user.id, 'from sender:', userId);
//     const result = await Chat.updateMany(
//       { receiver: req.user.id, sender: userId, isRead: false },
//       { $set: { isRead: true } }
//     );
//     console.log('Messages marked as read:', result.modifiedCount);
//     res.json({ message: 'Messages marked as read', modifiedCount: result.modifiedCount });
//   } catch (err) {
//     console.error('Error marking messages as read:', err.message);
//     res.status(500).json({ error: 'Failed to mark messages as read' });
//   }
// });

// // DELETE /api/chat/clear - Clear all chats for a user
// router.delete('/clear', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user.id) {
//       return res.status(400).json({ error: 'User ID is required' });
//     }

//     console.log('Clearing chats for user:', req.user.email);
//     const result = await Chat.deleteMany({
//       $or: [{ sender: req.user.id }, { receiver: req.user.id }],
//     });
//     console.log('Chats deleted:', result.deletedCount);
//     res.json({ message: 'Chats cleared', deletedCount: result.deletedCount });
//   } catch (err) {
//     console.error('Error clearing chats:', err.message);
//     res.status(500).json({ error: 'Failed to clear chats' });
//   }
// });

// module.exports = router;











const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/Chat');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all messages for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
      .populate('sender', 'email name role')
      .populate('receiver', 'email name role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send a message
router.post('/', authenticateToken, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Message content is required' });

  try {
    const sender = await User.findById(req.user.id);
    if (!sender) return res.status(404).json({ error: 'Sender not found' });

    // Find an admin to assign as receiver if sender is not admin
    let receiver = null;
    if (sender.role !== 'admin') {
      receiver = await User.findOne({ role: 'admin' });
      if (!receiver) return res.status(404).json({ error: 'No admin available' });
    }

    const message = new Message({
      sender: req.user.id,
      receiver: receiver ? receiver._id : null,
      content,
      role: sender.role
    });

    await message.save();
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'email name role')
      .populate('receiver', 'email name role');
    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all chats for admin
router.get('/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const messages = await Message.find({})
      .populate('sender', 'email name role')
      .populate('receiver', 'email name role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching all chats:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin reply to a user
router.post('/reply', authenticateToken, isAdmin, async (req, res) => {
  const { content, receiverId } = req.body;
  if (!content || !receiverId) {
    return res.status(400).json({ error: 'Content and receiver ID are required' });
  }

  try {
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Sender or receiver not found' });
    }

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content,
      role: 'admin'
    });

    await message.save();
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'email name role')
      .populate('receiver', 'email name role');
    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error('Error sending reply:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark messages as read
router.post('/mark-read', authenticateToken, async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  try {
    const result = await Message.updateMany(
      {
        sender: userId,
        receiver: req.user.id,
        isRead: false
      },
      { isRead: true }
    );
    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('Error marking messages as read:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear user's chat
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    await Message.deleteMany({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    });
    res.json({ message: 'Chat cleared' });
  } catch (err) {
    console.error('Error clearing chat:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin clear a specific user's chat
router.post('/clear-user', authenticateToken, isAdmin, async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await Message.deleteMany({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    });
    res.json({ message: 'User chat cleared' });
  } catch (err) {
    console.error('Error clearing user chat:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;