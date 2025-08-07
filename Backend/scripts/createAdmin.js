// backend/scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin account already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('AdminPassword123', 12);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      mobileNumber: '1234567890',
      address: 'Admin Address',
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    console.log('Admin account created successfully');
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();