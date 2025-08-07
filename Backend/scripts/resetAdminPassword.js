// backend/scripts/resetAdminPassword.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'admin@example.com' });
    if (!user) {
      console.log('Admin user not found');
      return;
    }

    const hashedPassword = await bcrypt.hash('AdminPassword123', 12);
    user.password = hashedPassword;
    await user.save();

    console.log('Admin password reset successfully to AdminPassword123');
  } catch (err) {
    console.error('Error resetting password:', err);
  } finally {
    mongoose.disconnect();
  }
};

resetAdminPassword();