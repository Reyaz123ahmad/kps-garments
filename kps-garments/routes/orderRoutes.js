// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { auth, isOwner, isCustomer } = require("../middlewares/auth");
const {
  
  getOrderHistory,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  assignOrderToAgent,
  verifyDeliveryOTP,
  getAgentOrders,
  getAgents,
  updateOrder
} = require("../controllers/orderController");

// Customer routes


router.get("/history", auth, getOrderHistory);
router.get("/:orderId", auth, getOrderById);
router.put("/cancel/:orderId", auth, isCustomer, cancelOrder);
router.put("/update/:orderId", auth, isCustomer, updateOrder)
// Owner/Admin routes
router.get("/admin/all", auth, isOwner, getAllOrders);
router.put("/admin/update-status/:orderId", auth, isOwner, updateOrderStatus);
router.put("/admin/assign-agent/:orderId", auth, isOwner, assignOrderToAgent)
router.get("/admin/agents", auth, isOwner, getAgents)

// Agent Routes
router.get("/agent/my-orders", auth, getAgentOrders)
router.put("/agent/delivery/:orderId", auth, verifyDeliveryOTP)

// Payment webhook route (no auth needed for webhook)
router.put("/update-payment-status", updatePaymentStatus);

module.exports = router;
