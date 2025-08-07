




// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   items: [
//     {
//       _id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//       },
//       imageUrl: {
//         type: String,
//         required: false,
//       },
//     },
//   ],
//   shipping: {
//     name: {
//       type: String,
//       required: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     postalCode: {
//       type: String,
//       required: true,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//   },
//   payment: {
//     method: {
//       type: String,
//       required: true,
//       enum: ['card', 'upi', 'wallet'],
//     },
//     upiId: {
//       type: String,
//       default: '',
//     },
//     cardLastFour: {
//       type: String,
//       default: '',
//     },
//     upiProvider: {
//       type: String,
//       default: '',
//       enum: ['', 'GPay', 'PhonePe', 'Paytm'],
//     },
//   },
//   totals: {
//     subtotal: {
//       type: Number,
//       required: true,
//     },
//     gstAmount: {
//       type: Number,
//       required: true,
//     },
//     promoDiscount: {
//       type: Number,
//       default: 0,
//     },
//     walletAmountUsed: {
//       type: Number,
//       default: 0,
//     },
//     baseTotal: {
//       type: Number,
//       required: true,
//     },
//     totalAmount: {
//       type: Number,
//       required: true,
//     },
//     promoCode: {
//       type: String,
//       default: '',
//     },
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested'],
//     default: 'Pending',
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   deliveredAt: {
//     type: Date,
//     default: null,
//   },
// });

// module.exports = mongoose.model('Order', orderSchema);





// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   items: [
//     {
//       _id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//       },
//       imageUrl: {
//         type: String,
//         required: false,
//       },
//     },
//   ],
//   shipping: {
//     name: {
//       type: String,
//       required: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     postalCode: {
//       type: String,
//       required: true,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//   },
//   payment: {
//     method: {
//       type: String,
//       required: true,
//       enum: ['card', 'upi', 'wallet'],
//     },
//     upiId: {
//       type: String,
//       default: '',
//     },
//     cardLastFour: {
//       type: String,
//       default: '',
//     },
//     upiProvider: {
//       type: String,
//       default: '',
//       enum: ['', 'GPay', 'PhonePe', 'Paytm'],
//     },
//   },
//   totals: {
//     subtotal: {
//       type: Number,
//       required: true,
//     },
//     gstAmount: {
//       type: Number,
//       required: true,
//     },
//     promoDiscount: {
//       type: Number,
//       default: 0,
//     },
//     walletAmountUsed: {
//       type: Number,
//       default: 0,
//     },
//     baseTotal: {
//       type: Number,
//       required: true,
//     },
//     totalAmount: {
//       type: Number,
//       required: true,
//     },
//     promoCode: {
//       type: String,
//       default: '',
//     },
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested'],
//     default: 'Pending',
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   deliveredAt: {
//     type: Date,
//     default: null,
//   },
//   returnDetails: {
//     reason: {
//       type: String,
//       default: '',
//     },
//     details: {
//       type: String,
//       default: '',
//     },
//   },
//   refundedAmount: {
//     type: Number,
//     default: 0,
//   },
// });

// module.exports = mongoose.model('Order', orderSchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  items: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      imageUrl: {
        type: String,
        required: false,
      },
    },
  ],
  shipping: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  payment: {
    method: {
      type: String,
      required: true,
    },
    upiId: {
      type: String,
      default: '',
    },
    cardLastFour: {
      type: String,
      default: '',
    },
    upiProvider: {
      type: String,
      default: '',
    },
  },
  totals: {
    subtotal: {
      type: Number,
      required: true,
    },
    gstAmount: {
      type: Number,
      required: true,
    },
    promoDiscount: {
      type: Number,
      default: 0,
    },
    walletAmountUsed: {
      type: Number,
      default: 0,
    },
    baseTotal: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    promoCode: {
      type: String,
      default: '',
    },
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'],
    default: 'Pending',
  },
  deliveredAt: {
    type: Date,
    default: null,
  },
  returnDetails: {
    reason: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
  },
  refundedAmount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);