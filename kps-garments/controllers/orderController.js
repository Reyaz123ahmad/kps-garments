// controllers/orderController.js
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const mailSender = require("../utils/mailSender");
const OTP = require("../models/OTP"); 

const deliveryOTPTemplate = require("../mail/templates/deliveryOTPTemplate");
const deliveryConfirmationTemplate = require("../mail/templates/deliveryConfirmationTemplate");
const { instance } = require("../config/razorpay");

// Get user's order history
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate('products.product')
      .sort({ createdAt: -1 }) // Latest first
      .exec();

    return res.status(200).json({
      success: true,
      orders: orders,
      count: orders.length
    });

  } catch (error) {
    console.error("Get order history error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order history",
      error: error.message
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ 
      _id: orderId, 
      user: userId 
    }).populate('products.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error("Get order by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message
    });
  }
};

// Cancel order (only if pending or confirmed)
// exports.cancelOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.id;

//     const order = await Order.findOne({ 
//       _id: orderId, 
//       user: userId 
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     // Check if order can be cancelled
//     if (!["pending", "confirmed"].includes(order.status)) {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot cancel order with status: ${order.status}`
//       });
//     }

//     order.status = "cancelled";
//     if (order.paymentStatus === "completed") {
//       order.paymentStatus = "refunded";
//     }

//     await order.save();

//     // Send cancellation email
//     try {
//       const user = await User.findById(userId);
//       const emailBody = `
//         <h2>Order Cancelled</h2>
//         <p>Dear ${user.firstName},</p>
//         <p>Your order <strong>#${order._id}</strong> has been cancelled successfully.</p>
//         <p><strong>Refund Amount:</strong> ₹${order.totalAmount}</p>
//         <p>Refund will be processed within 5-7 business days.</p>
//         <br/>
//         <p>Thank you!</p>
//       `;

//       await mailSender(user.email, "Order Cancellation Confirmation", emailBody);
//     } catch (emailError) {
//       console.error("Cancellation email failed:", emailError);
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Order cancelled successfully",
//       order: order
//     });

//   } catch (error) {
//     console.error("Cancel order error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to cancel order",
//       error: error.message
//     });
//   }
// };


exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel order with status: ${order.status}` });
    }

    order.status = "cancelled";
    order.paymentStatus = "refunding";
    await order.save();

    let refundDetails = null;
    if (order.paymentId) {
      try {
        const refund = await instance.payments.refund(order.paymentId, {
          speed: "optimum",
          notes: { reason: "Order cancelled by customer" }
        });

        order.paymentStatus = "refunded";
        order.refundId = refund.id;
        order.refundStatus = refund.status;
        await order.save();

        refundDetails = refund;
      } catch (refundError) {
        console.error("Refund failed:", refundError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled and refund initiated",
      order,
      refund: refundDetails
    });

  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message
    });
  }
};

// Admin/Owner: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'firstName lastName email phone')
      .populate('assignedAgent', 'firstName lastName email phone')
      .populate('products.product')
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json({
      success: true,
      orders: orders,
      totalOrders: orders.length
    });

  } catch (error) {
    console.error("Get all orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// Admin/Owner: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(orderId)
      .populate('user')
      .populate('products.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Send status update email to user
    try {
      const emailBody = `
        <h2>Order Status Updated</h2>
        <p>Dear ${order.user.firstName},</p>
        <p>Your order <strong>#${order._id}</strong> status has been updated:</p>
        <p><strong>From:</strong> ${oldStatus}</p>
        <p><strong>To:</strong> ${status}</p>
        <br/>
        <p>Thank you for shopping with us!</p>
      `;

      await mailSender(order.user.email, "Order Status Update", emailBody);
    } catch (emailError) {
      console.error("Status update email failed:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: order
    });

  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
};

// Update payment status (for payment webhook)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentStatus, paymentId, razorpayOrderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.paymentStatus = paymentStatus;
    if (paymentId) order.paymentId = paymentId;
    if (razorpayOrderId) order.razorpayOrderId = razorpayOrderId;

    // If payment completed, update order status to confirmed
    if (paymentStatus === "completed" && order.status === "pending") {
      order.status = "confirmed";
      
      // Clear user's cart
      await Cart.findOneAndUpdate(
        { user: order.user },
        { items: [], totalPrice: 0 }
      );
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order: order
    });

  } catch (error) {
    console.error("Update payment status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const data = req.body; // fields to update

    // Find order by ID and user
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Allowed fields to update
    const editableFields = ["shippingAddress", "status", "items"];
    editableFields.forEach(field => {
      if (data[field] !== undefined) {
        order[field] = data[field];
      }
    });

    order.lastUpdated = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order
    });

  } catch (error) {
    console.error("Update order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message
    });
  }
};






// Get all agents
exports.getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "Agent", isAvailable: true }).select('-password');
    res.json({
      success: true,
      agents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Assign order to agent and send OTP using existing OTP system
exports.assignOrderToAgent = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { agentId } = req.body;

    const order = await Order.findById(orderId)
    .populate('user', 'email firstName lastName')
    //.populate('assignedAgent', 'firstName lastName email phone');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if order is confirmed
    if (order.status !== "confirmed") { 
      return res.status(400).json({
        success: false, 
        message: `Cannot ship order with status: ${order.status}. Order must be confirmed first`
      })
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Update order
    order.assignedAgent = agentId;
    order.status = "shipped";
    order.deliveryOTP = {
      code: otp,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      verified: false
    };
    order.trackingInfo.shippedAt = new Date();

    await order.save();
    await order.populate('assignedAgent', 'firstName lastName email phone')

    // Send OTP using existing OTP system and mailSender
    try {
      // OTP database mein save karein (existing system use karte hue)
      await OTP.create({
        email: order.user.email,
        otp: otp
      });

      // Email send karein using template
      const emailBody = deliveryOTPTemplate(
        otp, 
        orderId, 
        `${order.user.firstName} ${order.user.lastName}`
      );

      await mailSender(
        order.user.email, 
        "Your Order Delivery OTP - KPS Garments", 
        emailBody
      );

      console.log(`Delivery OTP sent to ${order.user.email}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails
    }

    res.json({
      success: true,
      message: "Order assigned to agent successfully and OTP sent to customer",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get agent's assigned orders
exports.getAgentOrders = async (req, res) => {
  try {
    const agentId = req.user.id;
    
    const orders = await Order.find({ 
      assignedAgent: agentId,
      status: { $in: ["shipped", "delivered"] }
    })
    .populate("user", "firstName lastName phone email")
    .populate("products.product")
    .populate("assignedAgent", "firstName lastName");

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify OTP and mark delivered
exports.verifyDeliveryOTP = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { otp } = req.body;
    const agentId = req.user.id;

    const order = await Order.findById(orderId)
      .populate('user', 'firstName lastName email')
      .populate('assignedAgent', 'firstName lastName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if order is assigned to this agent
    if (order.assignedAgent._id.toString() !== agentId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to deliver this order"
      });
    }

    // Verify OTP from order's deliveryOTP field
    if (!order.deliveryOTP || order.deliveryOTP.code !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (order.deliveryOTP.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    // Update order status
    order.status = "delivered";
    order.deliveryOTP.verified = true;
    order.trackingInfo.deliveredAt = new Date();

    await order.save();

    // Send delivery confirmation email
    try {
      const emailBody = deliveryConfirmationTemplate(
        orderId,
        `${order.user.firstName} ${order.user.lastName}`,
        `${order.assignedAgent.firstName} ${order.assignedAgent.lastName}`,
        new Date().toLocaleString()
      );

      await mailSender(
        order.user.email,
        "Order Delivered Successfully - KPS Garments",
        emailBody
      );

      console.log(`Delivery confirmation sent to ${order.user.email}`);
    } catch (emailError) {
      console.error('Delivery email failed:', emailError);
    }

    res.json({
      success: true,
      message: "Order delivered successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
