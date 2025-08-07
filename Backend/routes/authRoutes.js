





// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');

// // Generate OTP
// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// // Middleware to verify token
// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split('Bearer ')[1];
//   if (!token) {
//     console.error('No token provided in request');
//     return res.status(401).json({ error: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error('Token verification error:', err.message);
//     res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };

// // Middleware to verify admin role
// const isAdmin = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user || user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
//     }
//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('Admin verification error:', err);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Email transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Verify transporter
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('Email transporter verification failed:', error);
//   } else {
//     console.log('Email transporter is ready to send messages');
//   }
// });

// // Admin registration
// router.post('/admin/register', isAdmin, async (req, res) => {
//   const { name, email, password, mobileNumber, address } = req.body;
//   try {
//     if (!name || !email || !password || !mobileNumber || !address) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const otp = generateOTP();
//     const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       mobileNumber,
//       address,
//       otp,
//       otpExpiresAt,
//       role: 'admin',
//       isVerified: true,
//     });
//     await newUser.save();
//     console.log(`Admin created: ${email}, OTP: ${otp}`);
//     const mailOptions = {
//       from: `"E-Commerce Admin" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Admin Account Created',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">Admin Account Created</h2>
//           <p>Hello ${name},</p>
//           <p>Your admin account has been created successfully.</p>
//           <p>Your OTP for verification is:</p>
//           <div style="background: #f4f4f4; padding: 10px; margin: 15px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
//             ${otp}
//           </div>
//           <p>This OTP will expire in 10 minutes.</p>
//           <p>Best regards,<br>E-Commerce Admin Team</p>
//         </div>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log(`Admin OTP sent to ${email}`);
//     res.status(201).json({
//       message: 'Admin account created. OTP sent to email.',
//       email,
//     });
//   } catch (err) {
//     console.error('Admin registration error:', err);
//     res.status(500).json({
//       message: 'Server error during admin registration',
//       error: err.message,
//     });
//   }
// });

// // Register + Send OTP
// router.post('/register', async (req, res) => {
//   const { name, email, password, mobileNumber, address } = req.body;
//   try {
//     if (!name || !email || !password || !mobileNumber || !address) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const otp = generateOTP();
//     const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       mobileNumber,
//       address,
//       otp,
//       otpExpiresAt,
//       role: 'user',
//     });
//     await newUser.save();
//     console.log(`User registered: ${email}, OTP: ${otp}`);
//     const mailOptions = {
//       from: `"E-Commerce Admin" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Verify Your Email',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">Email Verification</h2>
//           <p>Hello ${name},</p>
//           <p>Thank you for registering. Please use the following OTP to verify your email:</p>
//           <div style="background: #f4f4f4; padding: 10px; margin: 15px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
//             ${otp}
//           </div>
//           <p>This OTP will expire in 10 minutes.</p>
//           <p>If you didn't request this, please ignore this email.</p>
//           <p>Best regards,<br>E-Commerce Admin Team</p>
//         </div>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log(`OTP sent to ${email}`);
//     res.status(201).json({
//       message: 'OTP sent to email',
//       email,
//     });
//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({
//       message: 'Server error during registration',
//       error: err.message,
//     });
//   }
// });

// // Verify OTP
// router.post('/verify-otp', async (req, res) => {
//   const { email, otp } = req.body;
//   try {
//     if (!email || !otp) {
//       return res.status(400).json({ message: 'Email and OTP are required' });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User not found for OTP verification: ${email}`);
//       return res.status(404).json({ message: 'User not found' });
//     }
//     console.log(`Verifying OTP for ${email}: Input=${otp}, Stored=${user.otp}, ExpiresAt=${user.otpExpiresAt}`);
//     if (user.otp !== otp) {
//       console.log(`Invalid OTP for ${email}: Input=${otp}, Stored=${user.otp}`);
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }
//     if (user.otpExpiresAt < new Date()) {
//       console.log(`OTP expired for ${email}: ExpiresAt=${user.otpExpiresAt}`);
//       return res.status(400).json({ message: 'OTP has expired' });
//     }
//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpiresAt = undefined;
//     await user.save();
//     console.log(`OTP verified for ${email}`);
//     res.status(200).json({
//       message: 'Account verified successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error('OTP verification error:', err);
//     res.status(500).json({
//       message: 'Failed to verify OTP',
//       error: err.message,
//     });
//   }
// });

// // Resend OTP
// router.post('/resend-otp', async (req, res) => {
//   const { email } = req.body;
//   try {
//     if (!email) {
//       return res.status(400).json({ message: 'Email is required' });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User not found for OTP resend: ${email}`);
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const newOtp = generateOTP();
//     user.otp = newOtp;
//     user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
//     await user.save();
//     console.log(`New OTP generated for ${email}: ${newOtp}`);
//     const mailOptions = {
//       from: `"E-Commerce Admin" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'New OTP for Verification',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">New OTP Request</h2>
//           <p>Hello ${user.name},</p>
//           <p>Here is your new OTP for verification:</p>
//           <div style="background: #f4f4f4; padding: 10px; margin: 15px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
//             ${newOtp}
//           </div>
//           <p>This OTP will expire in 10 minutes.</p>
//           <p>If you didn't request this, please secure your account.</p>
//           <p>Best regards,<br>E-Commerce Admin Team</p>
//         </div>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log(`New OTP sent to ${email}`);
//     res.status(200).json({
//       message: 'New OTP sent successfully',
//       email,
//     });
//   } catch (err) {
//     console.error('Resend OTP error:', err);
//     res.status(500).json({
//       message: 'Error resending OTP',
//       error: err.message,
//     });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   console.log('Login attempt:', { email });
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log('User not found:', email);
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     if (!user.isVerified) {
//       console.log('User not verified:', email);
//       return res.status(401).json({ message: 'Account not verified. Please verify your email first.' });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log('Password mismatch:', email);
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign(
//       { id: user._id, email: user.email, name: user.name, role: user.role || 'user' },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );
//     console.log('Login successful:', email);
//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         mobileNumber: user.mobileNumber,
//         address: user.address,
//         role: user.role || 'user',
//       },
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// });

// // Refresh Token
// router.get('/refresh', async (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const newToken = jwt.sign(
//       { id: user._id, email: user.email, name: user.name, role: user.role || 'user' },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );
//     console.log(`Token refreshed for: ${user.email}`);
//     res.status(200).json({ token: newToken });
//   } catch (err) {
//     console.error('Refresh token error:', err);
//     res.status(401).json({ message: 'Invalid or expired token' });
//   }
// });

// // Check Auth
// router.get('/check-auth', (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.status(200).json({
//       message: 'Authenticated',
//       user: {
//         id: decoded.id,
//         name: decoded.name,
//         email: decoded.email,
//         mobileNumber: decoded.mobileNumber,
//         address: decoded.address,
//         role: decoded.role,
//       },
//     });
//   } catch (err) {
//     console.error('Check-auth error:', err);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// });

// // Update User Profile (Partial Update)
// router.patch('/profile', authMiddleware, async (req, res) => {
//   try {
//     const { name, email, mobileNumber } = req.body;

//     // Validate inputs
//     if (!name && !email && !mobileNumber) {
//       return res.status(400).json({ error: 'At least one field (name, email, mobileNumber) is required' });
//     }

//     const updates = {};
//     if (name) {
//       if (typeof name !== 'string' || name.trim().length < 2) {
//         return res.status(400).json({ error: 'Name must be a string with at least 2 characters' });
//       }
//       updates.name = name.trim();
//     }
//     if (email) {
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         return res.status(400).json({ error: 'Invalid email format' });
//       }
//       const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
//       if (existingUser) {
//         return res.status(400).json({ error: 'Email is already in use' });
//       }
//       updates.email = email;
//     }
//     if (mobileNumber) {
//       if (!/^\+?[1-9]\d{1,14}$/.test(mobileNumber)) {
//         return res.status(400).json({ error: 'Invalid phone number format' });
//       }
//       updates.mobileNumber = mobileNumber;
//     }

//     // Update user
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { $set: updates },
//       { new: true, runValidators: true }
//     ).select('_id name email mobileNumber address role');

//     if (!updatedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     console.log('User profile updated:', {
//       userId: updatedUser._id,
//       updates,
//     });

//     res.json(updatedUser);
//   } catch (err) {
//     console.error('Error updating profile:', err.message);
//     res.status(500).json({ error: 'Failed to update profile' });
//   }
// });

// // Update User Details (Full Update)
// router.put('/user', authMiddleware, async (req, res) => {
//   const { name, email, mobileNumber, address } = req.body;
//   try {
//     if (!name || !email || !mobileNumber || !address) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: 'Invalid email format' });
//     }
//     // Validate mobile number (10-12 digits)
//     const mobileRegex = /^\d{10,12}$/;
//     if (!mobileRegex.test(mobileNumber)) {
//       return res.status(400).json({ message: 'Mobile number must be 10-12 digits' });
//     }
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     // Check if email is taken by another user
//     if (email !== user.email) {
//       const existing = await User.findOne({ email });
//       if (existing) {
//         return res.status(400).json({ message: 'Email already in use' });
//       }
//     }
//     user.name = name;
//     user.email = email;
//     user.mobileNumber = mobileNumber;
//     user.address = address;
//     await user.save();
//     console.log(`User updated: ${email}`);
//     res.status(200).json({
//       message: 'Profile updated successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         mobileNumber: user.mobileNumber,
//         address: user.address,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error('Update user error:', err);
//     res.status(500).json({ message: 'Server error updating profile', error: err.message });
//   }
// });

// // Change Password
// router.post('/user/change-password', authMiddleware, async (req, res) => {
//   const { currentPassword, newPassword, confirmNewPassword } = req.body;
//   try {
//     if (!currentPassword || !newPassword || !confirmNewPassword) {
//       return res.status(400).json({ message: 'All password fields are required' });
//     }
//     if (newPassword !== confirmNewPassword) {
//       return res.status(400).json({ message: 'New passwords do not match' });
//     }
//     if (newPassword.length < 8) {
//       return res.status(400).json({ message: 'New password must be at least 8 characters' });
//     }
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Current password is incorrect' });
//     }
//     const hashedPassword = await bcrypt.hash(newPassword, 12);
//     user.password = hashedPassword;
//     await user.save();
//     console.log(`Password changed for: ${user.email}`);
//     res.status(200).json({ message: 'Password changed successfully' });
//   } catch (err) {
//     console.error('Change password error:', err);
//     res.status(500).json({ message: 'Server error changing password', error: err.message });
//   }
// });

// // Get user count
// router.get('/user-count', authMiddleware, async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const verifiedUsers = await User.countDocuments({ isVerified: true });
//     res.status(200).json({
//       totalUsers,
//       verifiedUsers,
//     });
//   } catch (err) {
//     console.error('User count error:', err);
//     res.status(500).json({ message: 'Server error retrieving user count' });
//   }
// });

// // Get all users
// router.get('/users', authMiddleware, async (req, res) => {
//   try {
//     const users = await User.find().select('_id name email mobileNumber address role isVerified createdAt');
//     console.log('Fetched users:', users.map(u => ({ email: u.email, mobileNumber: u.mobileNumber, address: u.address })));
//     res.json(users);
//   } catch (err) {
//     console.error('Fetch users error:', err);
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });

// module.exports = { router, authMiddleware };






// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');

// // Generate OTP
// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// // Middleware to verify token
// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split('Bearer ')[1];
//   if (!token) {
//     console.error('No token provided in request');
//     return res.status(401).json({ error: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error('Token verification error:', err.message);
//     res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };

// // Middleware to verify admin role
// const isAdmin = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user || user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
//     }
//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('Admin verification error:', err);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Email transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Verify transporter
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('Email transporter verification failed:', error);
//   } else {
//     console.log('Email transporter is ready to send messages');
//   }
// });

// // Admin registration
// router.post('/admin/register', isAdmin, async (req, res) => {
//   const { name, email, password, mobileNumber, address } = req.body;
//   try {
//     if (!name || !email || !password || !mobileNumber || !address) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const otp = generateOTP();
//     const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       mobileNumber,
//       address,
//       otp,
//       otpExpiresAt,
//       role: 'admin',
//       isVerified: true,
//     });
//     await newUser.save();
//     console.log(`Admin created: ${email}, OTP: ${otp}`);
//     const mailOptions = {
//       from: `"E-Commerce Admin" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Admin Account Created',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">Admin Account Created</h2>
//           <p>Hello ${name},</p>
//           <p>Your admin account has been created successfully.</p>
//           <p>Your OTP for verification is:</p>
//           <div style="background: #f4f4f4; padding: 10px; margin: 15px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
//             ${otp}
//           </div>
//           <p>This OTP will expire in 10 minutes.</p>
//           <p>Best regards,<br>E-Commerce Admin Team</p>
//         </div>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log(`Admin OTP sent to ${email}`);
//     res.status(201).json({
//       message: 'Admin account created. OTP sent to email.',
//       email,
//     });
//   } catch (err) {
//     console.error('Admin registration error:', err);
//     res.status(500).json({
//       message: 'Server error during admin registration',
//       error: err.message,
//     });
//   }
// });

// // Register + Send OTP
// router.post('/register', async (req, res) => {
//   const { name, email, password, mobileNumber, address } = req.body;
//   try {
//     if (!name || !email || !password || !mobileNumber || !address) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const otp = generateOTP();
//     const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       mobileNumber,
//       address,
//       otp,
//       otpExpiresAt,
//       role: 'user',
//     });
//     await newUser.save();
//     console.log(`User registered: ${email}, OTP: ${otp}`);
//     const mailOptions = {
//       from: `"E-Commerce Admin" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Verify Your Email',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">Email Verification</h2>
//           <p>Hello ${name},</p>
//           <p>Thank you for registering. Please use the following OTP to verify your email:</p>
//           <div style="background: #f4f4f4; padding: 10px; margin: 15px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
//             ${otp}
//           </div>
//           <p>This OTP will expire in 10 minutes.</p>
//           <p>If you didn't request this, please ignore this email.</p>
//           <p>Best regards,<br>E-Commerce Admin Team</p>
//         </div>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log(`OTP sent to ${email}`);
//     res.status(201).json({
//       message: 'OTP sent to email',
//       email,
//     });
//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({
//       message: 'Server error during registration',
//       error: err.message,
//     });
//   }
// });

// // Verify OTP
// router.post('/verify-otp', async (req, res) => {
//   const { email, otp } = req.body;
//   try {
//     if (!email || !otp) {
//       return res.status(400).json({ message: 'Email and OTP are required' });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User not found for OTP verification: ${email}`);
//       return res.status(404).json({ message: 'User not found' });
//     }
//     console.log(`Verifying OTP for ${email}: Input=${otp}, Stored=${user.otp}, ExpiresAt=${user.otpExpiresAt}`);
//     if (user.otp !== otp) {
//       console.log(`Invalid OTP for ${email}: Input=${otp}, Stored=${user.otp}`);
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }
//     if (user.otpExpiresAt < new Date()) {
//       console.log(`OTP expired for ${email}: ExpiresAt=${user.otpExpiresAt}`);
//       return res.status(400).json({ message: 'OTP has expired' });
//     }
//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpiresAt = undefined;
//     await user.save();
//     console.log(`OTP verified for ${email}`);
//     res.status(200).json({
//       message: 'Account verified successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error('OTP verification error:', err);
//     res.status(500).json({
//       message: 'Failed to verify OTP',
//       error: err.message,
//     });
//   }
// });

// // Resend OTP
// router.post('/resend-otp', async (req, res) => {
//   const { email } = req.body;
//   try {
//     if (!email) {
//       return res.status(400).json({ message: 'Email is required' });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User not found for OTP resend: ${email}`);
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const newOtp = generateOTP();
//     user.otp = newOtp;
//     user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
//     await user.save();
//     console.log(`New OTP generated for ${email}: ${newOtp}`);
//     const mailOptions = {
//       from: `"E-Commerce Admin" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'New OTP for Verification',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">New OTP Request</h2>
//           <p>Hello ${user.name},</p>
//           <p>Here is your new OTP for verification:</p>
//           <div style="background: #f4f4f4; padding: 10px; margin: 15px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
//             ${newOtp}
//           </div>
//           <p>This OTP will expire in 10 minutes.</p>
//           <p>If you didn't request this, please secure your account.</p>
//           <p>Best regards,<br>E-Commerce Admin Team</p>
//         </div>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log(`New OTP sent to ${email}`);
//     res.status(200).json({
//       message: 'New OTP sent successfully',
//       email,
//     });
//   } catch (err) {
//     console.error('Resend OTP error:', err);
//     res.status(500).json({
//       message: 'Error resending OTP',
//       error: err.message,
//     });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   console.log('Login attempt:', { email });
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log('User not found:', email);
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     if (!user.isVerified) {
//       console.log('User not verified:', email);
//       return res.status(401).json({ message: 'Account not verified. Please verify your email first.' });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log('Password mismatch:', email);
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign(
//       { id: user._id, email: user.email, name: user.name, role: user.role || 'user' },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );
//     console.log('Login successful:', email);
//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         mobileNumber: user.mobileNumber,
//         address: user.address,
//         role: user.role || 'user',
//       },
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// });

// // Refresh Token
// router.get('/refresh', async (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const newToken = jwt.sign(
//       { id: user._id, email: user.email, name: user.name, role: user.role || 'user' },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );
//     console.log(`Token refreshed for: ${user.email}`);
//     res.status(200).json({ token: newToken });
//   } catch (err) {
//     console.error('Refresh token error:', err);
//     res.status(401).json({ message: 'Invalid or expired token' });
//   }
// });

// // Check Auth
// router.get('/check-auth', (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.status(200).json({
//       message: 'Authenticated',
//       user: {
//         id: decoded.id,
//         name: decoded.name,
//         email: decoded.email,
//         mobileNumber: decoded.mobileNumber,
//         address: decoded.address,
//         role: decoded.role,
//       },
//     });
//   } catch (err) {
//     console.error('Check-auth error:', err);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// });

// // Update User Profile (Partial Update)
// router.patch('/profile', authMiddleware, async (req, res) => {
//   try {
//     const { name, email, mobileNumber } = req.body;

//     // Validate inputs
//     if (!name && !email && !mobileNumber) {
//       return res.status(400).json({ error: 'At least one field (name, email, mobileNumber) is required' });
//     }

//     const updates = {};
//     if (name) {
//       if (typeof name !== 'string' || name.trim().length < 2) {
//         return res.status(400).json({ error: 'Name must be a string with at least 2 characters' });
//       }
//       updates.name = name.trim();
//     }
//     if (email) {
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         return res.status(400).json({ error: 'Invalid email format' });
//       }
//       const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
//       if (existingUser) {
//         return res.status(400).json({ error: 'Email is already in use' });
//       }
//       updates.email = email;
//     }
//     if (mobileNumber) {
//       if (!/^\+?[1-9]\d{1,14}$/.test(mobileNumber)) {
//         return res.status(400).json({ error: 'Invalid phone number format' });
//       }
//       updates.mobileNumber = mobileNumber;
//     }

//     // Update user
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { $set: updates },
//       { new: true, runValidators: true }
//     ).select('_id name email mobileNumber address role');

//     if (!updatedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     console.log('User profile updated:', {
//       userId: updatedUser._id,
//       updates,
//     });

//     res.json(updatedUser);
//   } catch (err) {
//     console.error('Error updating profile:', err.message);
//     res.status(500).json({ error: 'Failed to update profile' });
//   }
// });

// // Update User Details (Full Update)
// router.put('/user', authMiddleware, async (req, res) => {
//   const { name, email, mobileNumber, address } = req.body;
//   try {
//     if (!name || !email || !mobileNumber || !address) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: 'Invalid email format' });
//     }
//     // Validate mobile number (10-12 digits)
//     const mobileRegex = /^\d{10,12}$/;
//     if (!mobileRegex.test(mobileNumber)) {
//       return res.status(400).json({ message: 'Mobile number must be 10-12 digits' });
//     }
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     // Check if email is taken by another user
//     if (email !== user.email) {
//       const existing = await User.findOne({ email });
//       if (existing) {
//         return res.status(400).json({ message: 'Email already in use' });
//       }
//     }
//     user.name = name;
//     user.email = email;
//     user.mobileNumber = mobileNumber;
//     user.address = address;
//     await user.save();
//     console.log(`User updated: ${email}`);
//     res.status(200).json({
//       message: 'Profile updated successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         mobileNumber: user.mobileNumber,
//         address: user.address,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error('Update user error:', err);
//     res.status(500).json({ message: 'Server error updating profile', error: err.message });
//   }
// });

// // Change Password
// router.post('/user/change-password', authMiddleware, async (req, res) => {
//   const { currentPassword, newPassword, confirmNewPassword } = req.body;
//   try {
//     if (!currentPassword || !newPassword || !confirmNewPassword) {
//       return res.status(400).json({ message: 'All password fields are required' });
//     }
//     if (newPassword !== confirmNewPassword) {
//       return res.status(400).json({ message: 'New passwords do not match' });
//     }
//     if (newPassword.length < 8) {
//       return res.status(400).json({ message: 'New password must be at least 8 characters' });
//     }
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Current password is incorrect' });
//     }
//     const hashedPassword = await bcrypt.hash(newPassword, 12);
//     user.password = hashedPassword;
//     await user.save();
//     console.log(`Password changed for: ${user.email}`);
//     res.status(200).json({ message: 'Password changed successfully' });
//   } catch (err) {
//     console.error('Change password error:', err);
//     res.status(500).json({ message: 'Server error changing password', error: err.message });
//   }
// });

// // Get user count
// router.get('/user-count', authMiddleware, async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const verifiedUsers = await User.countDocuments({ isVerified: true });
//     res.status(200).json({
//       totalUsers,
//       verifiedUsers,
//     });
//   } catch (err) {
//     console.error('User count error:', err);
//     res.status(500).json({ message: 'Server error retrieving user count' });
//   }
// });

// // Get all users
// router.get('/users', authMiddleware, async (req, res) => {
//   try {
//     const users = await User.find().select('_id name email mobileNumber address role isVerified createdAt');
//     console.log('Fetched users:', users.map(u => ({ email: u.email, mobileNumber: u.mobileNumber, address: u.address })));
//     res.json(users);
//   } catch (err) {
//     console.error('Fetch users error:', err);
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });

// // Forgot Password - Send OTP
// router.post('/forgot-password', async (req, res) => {
//   const { email } = req.body;
//   try {
//     if (!email) {
//       return res.status(400).json({ message: 'Email is required' });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User not found for password reset: ${email}`);
//       return res.status(404).json({ message: 'User not found' });
//     }
//     // Generate OTP
//     const otp = generateOTP();
//     user.otp = otp;
//     user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
//     await user.save();
//     console.log(`Password reset OTP generated for ${email}: ${otp}`);
//     // Send OTP via email
//     const mailOptions = {
//       from: `"E-Commerce Admin" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Password Reset OTP',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">Password Reset Request</h2>
//           <p>Hello ${user.name},</p>
//           <p>We received a request to reset your password. Please use the following OTP to reset your password:</p>
//           <div style="background: #f4f4f4; padding: 10px; margin: 15px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
//             ${otp}
//           </div>
//           <p>This OTP will expire in 10 minutes.</p>
//           <p>If you didn't request a password reset, please ignore this email or contact support.</p>
//           <p>Best regards,<br>E-Commerce Admin Team</p>
//         </div>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log(`Password reset OTP sent to ${email}`);
//     res.status(200).json({
//       message: 'OTP sent to your email for password reset',
//       email,
//     });
//   } catch (err) {
//     console.error('Forgot password error:', err);
//     res.status(500).json({
//       message: 'Error processing password reset request',
//       error: err.message,
//     });
//   }
// });

// // Verify Reset OTP
// router.post('/verify-reset-otp', async (req, res) => {
//   const { email, otp } = req.body;
//   try {
//     if (!email || !otp) {
//       return res.status(400).json({ message: 'Email and OTP are required' });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User not found for OTP verification: ${email}`);
//       return res.status(404).json({ message: 'User not found' });
//     }
//     console.log(`Verifying reset OTP for ${email}: Input=${otp}, Stored=${user.otp}, ExpiresAt=${user.otpExpiresAt}`);
//     if (user.otp !== otp) {
//       console.log(`Invalid OTP for ${email}: Input=${otp}, Stored=${user.otp}`);
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }
//     if (user.otpExpiresAt < new Date()) {
//       console.log(`OTP expired for ${email}: ExpiresAt=${user.otpExpiresAt}`);
//       return res.status(400).json({ message: 'OTP has expired' });
//     }
//     console.log(`Reset OTP verified for ${email}`);
//     res.status(200).json({
//       message: 'OTP verified successfully',
//     });
//   } catch (err) {
//     console.error('Reset OTP verification error:', err);
//     res.status(500).json({
//       message: 'Failed to verify OTP',
//       error: err.message,
//     });
//   }
// });

// // Reset Password - Verify OTP and Update Password
// router.post('/reset-password-otp', async (req, res) => {
//   const { email, otp, newPassword, confirmNewPassword } = req.body;
//   try {
//     if (!email || !otp || !newPassword || !confirmNewPassword) {
//       return res.status(400).json({ message: 'Email, OTP, and password fields are required' });
//     }
//     if (newPassword !== confirmNewPassword) {
//       return res.status(400).json({ message: 'Passwords do not match' });
//     }
//     if (newPassword.length < 8) {
//       return res.status(400).json({ message: 'Password must be at least 8 characters' });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User not found for password reset: ${email}`);
//       return res.status(404).json({ message: 'User not found' });
//     }
//     if (user.otp !== otp) {
//       console.log(`Invalid OTP for ${email}: Input=${otp}, Stored=${user.otp}`);
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }
//     if (user.otpExpiresAt < new Date()) {
//       console.log(`OTP expired for ${email}: ExpiresAt=${user.otpExpiresAt}`);
//       return res.status(400).json({ message: 'OTP has expired' });
//     }
//     // Update password
//     const hashedPassword = await bcrypt.hash(newPassword, 12);
//     user.password = hashedPassword;
//     user.otp = undefined;
//     user.otpExpiresAt = undefined;
//     await user.save();
//     console.log(`Password reset successful for: ${email}`);
//     res.status(200).json({
//       message: 'Password reset successfully',
//     });
//   } catch (err) {
//     console.error('Reset password error:', err);
//     res.status(500).json({
//       message: 'Error resetting password',
//       error: err.message,
//     });
//   }
// });

// module.exports = { router, authMiddleware };









const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    console.error('No token provided in request');
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to verify admin role
const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Admin verification error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

// Admin registration
router.post('/admin/register', isAdmin, async (req, res) => {
  const { name, email, password, mobileNumber, address } = req.body;
  try {
    if (!name || !email || !password || !mobileNumber || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      address,
      otp,
      otpExpiresAt,
      role: 'admin',
      isVerified: true,
    });
    await newUser.save();
    console.log(`Admin created: ${email}, OTP: ${otp}`);
    const mailOptions = {
      from: `"E-Commerce Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Admin Account Created',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Admin Account Created</h2>
          <p>Hello ${name},</p>
          <p>Your admin account has been created successfully.</p>
          <p>Your OTP for verification is:</p>
          <div style="background: #f4f4f4; padding: 10px; margin: 15px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>Best regards,<br>E-Commerce Admin Team</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Admin OTP sent to ${email}`);
    res.status(201).json({
      message: 'Admin account created. OTP sent to email.',
      email,
    });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({
      message: 'Server error during admin registration',
      error: err.message,
    });
  }
});

// Register + Send OTP
router.post('/register', async (req, res) => {
  const { name, email, password, mobileNumber, address } = req.body;
  try {
    if (!name || !email || !password || !mobileNumber || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      address,
      otp,
      otpExpiresAt,
      role: 'user',
    });
    await newUser.save();
    console.log(`User registered: ${email}, OTP: ${otp}`);
    const mailOptions = {
      from: `"E-Commerce Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering. Please use the following OTP to verify your email:</p>
          <div style="background: #f4f4f4; padding: 10px; margin: 15px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>E-Commerce Admin Team</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    res.status(201).json({
      message: 'OTP sent to email',
      email,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      message: 'Server error during registration',
      error: err.message,
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for OTP verification: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(`Verifying OTP for ${email}: Input=${otp}, Stored=${user.otp}, ExpiresAt=${user.otpExpiresAt}`);
    if (user.otp !== otp) {
      console.log(`Invalid OTP for ${email}: Input=${otp}, Stored=${user.otp}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (user.otpExpiresAt < new Date()) {
      console.log(`OTP expired for ${email}: ExpiresAt=${user.otpExpiresAt}`);
      return res.status(400).json({ message: 'OTP has expired' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    console.log(`OTP verified for ${email}`);
    res.status(200).json({
      message: 'Account verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({
      message: 'Failed to verify OTP',
      error: err.message,
    });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for OTP resend: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }
    const newOtp = generateOTP();
    user.otp = newOtp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    console.log(`New OTP generated for ${email}: ${newOtp}`);
    const mailOptions = {
      from: `"E-Commerce Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'New OTP for Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New OTP Request</h2>
          <p>Hello ${user.name},</p>
          <p>Here is your new OTP for verification:</p>
          <div style="background: #f4f4f4; padding: 10px; margin: 15px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
            ${newOtp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please secure your account.</p>
          <p>Best regards,<br>E-Commerce Admin Team</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`New OTP sent to ${email}`);
    res.status(200).json({
      message: 'New OTP sent successfully',
      email,
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({
      message: 'Error resending OTP',
      error: err.message,
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
      console.log('User not verified:', email);
      return res.status(401).json({ message: 'Account not verified. Please verify your email first.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Login successful:', email);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        address: user.address,
        role: user.role || 'user',
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Refresh Token
router.get('/refresh', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newToken = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(`Token refreshed for: ${user.email}`);
    res.status(200).json({ token: newToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Check Auth
router.get('/check-auth', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      message: 'Authenticated',
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        mobileNumber: decoded.mobileNumber,
        address: decoded.address,
        role: decoded.role,
      },
    });
  } catch (err) {
    console.error('Check-auth error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update User Profile (Partial Update)
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, mobileNumber, address } = req.body;

    // Validate inputs
    if (!name && !email && !mobileNumber && !address) {
      return res.status(400).json({ error: 'At least one field (name, email, mobileNumber, address) is required' });
    }

    const updates = {};
    if (name) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'Name must be a string with at least 2 characters' });
      }
      updates.name = name.trim();
    }
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
      updates.email = email.trim();
    }
    if (mobileNumber) {
      if (!/^\d{10,12}$/.test(mobileNumber)) {
        return res.status(400).json({ error: 'Mobile number must be 10-12 digits' });
      }
      updates.mobileNumber = mobileNumber;
    }
    if (address) {
      if (typeof address !== 'string' || address.trim().length < 5) {
        return res.status(400).json({ error: 'Address must be a string with at least 5 characters' });
      }
      updates.address = address.trim();
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('_id name email mobileNumber address role');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User profile updated:', {
      userId: updatedUser._id,
      updates,
    });

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update User Details (Full Update)
router.put('/user', authMiddleware, async (req, res) => {
  const { name, email, mobileNumber, address } = req.body;
  try {
    if (!name || !email || !mobileNumber || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    // Validate mobile number (10-12 digits)
    const mobileRegex = /^\d{10,12}$/;
    if (!mobileRegex.test(mobileNumber)) {
      return res.status(400).json({ message: 'Mobile number must be 10-12 digits' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if email is taken by another user
    if (email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    user.name = name;
    user.email = email;
    user.mobileNumber = mobileNumber;
    user.address = address;
    await user.save();
    console.log(`User updated: ${email}`);
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        address: user.address,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server error updating profile', error: err.message });
  }
});

// Change Password
router.post('/user/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  try {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    console.log(`Password changed for: ${user.email}`);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error changing password', error: err.message });
  }
});

// Get user count
router.get('/user-count', authMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    res.status(200).json({
      totalUsers,
      verifiedUsers,
    });
  } catch (err) {
    console.error('User count error:', err);
    res.status(500).json({ message: 'Server error retrieving user count' });
  }
});

// Get all users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('_id name email mobileNumber address role isVerified createdAt');
    console.log('Fetched users:', users.map(u => ({ email: u.email, mobileNumber: u.mobileNumber, address: u.address })));
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for password reset: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();
    console.log(`Password reset OTP generated for ${email}: ${otp}`);
    // Send OTP via email
    const mailOptions = {
      from: `"E-Commerce Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your password. Please use the following OTP to reset your password:</p>
          <div style="background: #f4f4f4; padding: 10px; margin: 15px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email or contact support.</p>
          <p>Best regards,<br>E-Commerce Admin Team</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Password reset OTP sent to ${email}`);
    res.status(200).json({
      message: 'OTP sent to your email for password reset',
      email,
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({
      message: 'Error processing password reset request',
      error: err.message,
    });
  }
});

// Verify Reset OTP
router.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for OTP verification: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(`Verifying reset OTP for ${email}: Input=${otp}, Stored=${user.otp}, ExpiresAt=${user.otpExpiresAt}`);
    if (user.otp !== otp) {
      console.log(`Invalid OTP for ${email}: Input=${otp}, Stored=${user.otp}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (user.otpExpiresAt < new Date()) {
      console.log(`OTP expired for ${email}: ExpiresAt=${user.otpExpiresAt}`);
      return res.status(400).json({ message: 'OTP has expired' });
    }
    console.log(`Reset OTP verified for ${email}`);
    res.status(200).json({
      message: 'OTP verified successfully',
    });
  } catch (err) {
    console.error('Reset OTP verification error:', err);
    res.status(500).json({
      message: 'Failed to verify OTP',
      error: err.message,
    });
  }
});

// Reset Password - Verify OTP and Update Password
router.post('/reset-password-otp', async (req, res) => {
  const { email, otp, newPassword, confirmNewPassword } = req.body;
  try {
    if (!email || !otp || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'Email, OTP, and password fields are required' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for password reset: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.otp !== otp) {
      console.log(`Invalid OTP for ${email}: Input=${otp}, Stored=${user.otp}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (user.otpExpiresAt < new Date()) {
      console.log(`OTP expired for ${email}: ExpiresAt=${user.otpExpiresAt}`);
      return res.status(400).json({ message: 'OTP has expired' });
    }
    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    console.log(`Password reset successful for: ${email}`);
    res.status(200).json({
      message: 'Password reset successfully',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({
      message: 'Error resetting password',
      error: err.message,
    });
  }
});

module.exports = { router, authMiddleware };