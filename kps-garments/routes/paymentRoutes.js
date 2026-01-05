// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  capturePayment,
  verifySignature,
  //paymentWebhook
} = require("../controllers/paymentController");

// Payment routes
router.post("/capture", auth, capturePayment);
router.post("/verify", auth, verifySignature);
//router.post("/webhook", paymentWebhook); // Webhook doesn't need auth

module.exports = router;