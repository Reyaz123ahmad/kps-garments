// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
} = require("../controllers/cartController");

// Cart routes
router.post("/add", auth, addToCart);
router.get("/", auth, getCart);
router.put("/update", auth, updateCartItem);
router.delete("/remove/:productId", auth, removeFromCart);
router.delete("/clear", auth, clearCart);
router.get("/count", auth, getCartCount);

module.exports = router;