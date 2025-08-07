
// // backend/models/User.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   mobileNumber: { type: String, required: true },
//   address: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin'], default: 'user' },
//   isVerified: { type: Boolean, default: false },
//   otp: { type: String },
//   otpExpiresAt: { type: Date },
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);




const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiresAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);