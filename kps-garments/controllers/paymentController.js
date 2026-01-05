// controllers/paymentController.js (Modified for products)
const crypto = require("crypto");
const { instance } = require("../config/razorpay");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const Order = require("../models/Order"); // Ye banana hoga
const mailSender = require("../utils/mailSender");
const Cart = require("../models/Cart");
const customerTemplate = require("../mail/templates/customerOrderTemplate");
const ownerTemplate = require("../mail/templates/ownerOrderTemplate");


// Create Razorpay Order for Products
exports.capturePayment = async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress } = req.body;
    const userId = req.user.id;

    if (!products || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Products and total amount are required",
      });
    }

    // Validate products and calculate total
    let calculatedAmount = 0;
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }
      calculatedAmount += product.price * item.quantity;
    }

    if (calculatedAmount !== totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Total amount mismatch",
      });
    }

    const options = {
      amount: totalAmount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        products,
        shippingAddress,
        totalAmount
      },
    };

    const order = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      products: products,
    });
  } catch (error) {
    console.error("Payment initiation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not initiate payment",
    });
  }
};

exports.verifySignature = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      products,
      totalAmount,
      shippingAddress
    } = req.body;

    const secret = process.env.RAZORPAY_SECRET;
    if (!secret) throw new Error("RAZORPAY_SECRET is not defined");

    // Verify Razorpay signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Check if order already exists
    let order = await Order.findOne({ orderId: razorpay_order_id });

    if (order) {
      // Update existing order
      order.status = "confirmed";
      order.paymentStatus = "completed";
      order.paymentId = razorpay_payment_id;
      await order.save();
    } else {
      // Enrich products
      if (!Array.isArray(products)) {
        return res.status(400).json({
          success: false,
          message: "Invalid products format. Expected an array."
        });
      }

      const enrichedProducts = [];
      for (const item of products) {
        const productData = await Product.findById(item.productId);
        if (!productData) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.productId}`,
          });
        }

        enrichedProducts.push({
          product: productData._id,
          quantity: item.quantity,
          price: productData.price,
          name: productData.name,
          size: productData.size
        });
      }

      // Create order after payment
      order = await Order.create({
        user: req.user.id,
        products: enrichedProducts,
        totalAmount,
        shippingAddress,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: "confirmed",
        paymentStatus: "completed"
      });

      await User.findByIdAndUpdate(req.user.id, {
        $push: { orders: order._id }
      });

      await Cart.findOneAndUpdate(
        { user: req.user.id },
        { items: [], totalPrice: 0, totalItems: 0 }
      );

      // Send emails
      const user = await User.findById(req.user.id);
      const owner = await User.findOne({ role: "Owner" });

      const customerEmailBody = customerTemplate({
        user,
        order,
        shippingAddress,
        paymentId: razorpay_payment_id
      });

      const ownerEmailBody = owner?.email ? ownerTemplate({
        user,
        order,
        shippingAddress,
        paymentId: razorpay_payment_id,
        enrichedProducts
      }) : "";

      try {
        await mailSender(user.email, "Your Order is Confirmed - KPS Garments", customerEmailBody);
        if (owner?.email) {
          await mailSender(owner.email, "New Order Received - Action Required", ownerEmailBody);
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and order created",
      order
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing payment",
    });
  }
};
