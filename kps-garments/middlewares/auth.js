const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/UserModel");

// 🔐 Middleware: Authenticate User
exports.auth = async (req, res, next) => {
  try {
    // Extract token from cookie, body, or header
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("Cookies:", req.cookies);
    console.log("Body:", req.body);
    console.log("Headers:", req.headers);

    // If token is missing
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token missing",
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Token is invalid",
      });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating token",
    });
  }
};

//
// 🧑‍🎓 Role Middleware: Customer
//
exports.isCustomer = async (req, res, next) => {
  try {
    if (req.user.role?.toLowerCase() !== "customer") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for customers only",
      });
    }
    next();
  } catch (error) {
    console.error("Customer role error:", error);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

// 🛡️ Role Middleware: Owner
exports.isOwner = async (req, res, next) => {
  try {
    if (req.user.role?.toLowerCase() !== "owner") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for owner only",
      });
    }
    next();
  } catch (error) {
    console.error("Owner role error:", error);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};
