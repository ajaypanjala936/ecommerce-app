// const mongoose = require('mongoose');
// const validator = require('validator');

// const newsletterSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     trim: true,
//     validate: {
//       validator: (value) => validator.isEmail(value),
//       message: 'Invalid email address',
//     },
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Index for faster queries
// newsletterSchema.index({ email: 1 });

// module.exports = mongoose.model('Newsletter', newsletterSchema);


const mongoose = require('mongoose');
const validator = require('validator');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Invalid email address',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Newsletter', newsletterSchema);