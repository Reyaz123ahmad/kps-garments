// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  products: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product",
      required: true 
    },
    quantity: { 
      type: Number, 
      default: 1,
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    }
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], 
    default: "pending" 
  },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "completed", "failed", "refunded", "refunding"], 
    default: "pending" 
  },
  paymentId: String,
  orderId: String,
  razorpayOrderId: String,
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  deliveryOTP: {
    code: String,
    expiresAt: Date,
    deliveredAt: Date
  },
  trackingInfo: {
    shippedAt: { type: Date },
    deliveredAt: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
