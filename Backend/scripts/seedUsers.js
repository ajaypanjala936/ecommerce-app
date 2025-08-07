// backend/scripts/seedUsers.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({ role: 'user' }); // Keep admin user

    const users = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('Password123', 10),
        role: 'user',
        isVerified: true,
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('Password123', 10),
        role: 'user',
        isVerified: false,
      },
    ];

    await User.insertMany(users);
    console.log('Users seeded successfully');
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    mongoose.disconnect();
  }
};

seedUsers();