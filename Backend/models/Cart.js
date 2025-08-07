




// const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   imageUrl: {
//     type: String
//   }
// }, { _id: false });

// const cartSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     unique: true
//   },
//   items: [cartItemSchema],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// cartSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model('Cart', cartSchema);



const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  }
  // Removed _id: false to allow Mongoose to generate _id for each cart item
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);