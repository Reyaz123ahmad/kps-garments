
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const otpGenerator = require("otp-generator");
const User = require("../models/UserModel");
const OTP = require("../models/OTP");

const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      role,
      otp,
      phone,
      gender
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp || !phone || !gender) {
      return res.status(403).json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Password and confirm password do not match" });
    }

    if (!["Owner", "Customer", "Agent"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid account type" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists. Please sign in." });
    }
    // Prevent multiple Admin registrations
    if (role.toLowerCase() === "owner") {
      const existingOwner = await User.findOne({ role:{$regex: /^owner$/i} });
      if (existingOwner) {
        return res.status(403).json({
          success: false,
          message: "Owner account already exists. Only one owner allowed.",
        });
      }
    }

    // Verify OTP
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log("Received OTP:", otp);
    console.log("Expected OTP:", recentOtp[0].otp);

    if (recentOtp.length === 0 || otp !== recentOtp[0].otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const approved = role === "Customer" ? false : true;

    // Create User
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phone,
      gender,
      approved,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({ 
        success: true, 
        user, 
        message: "User registered successfully" 
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({ 
        success: false, 
        message: "User registration failed" 
    });
  }
};


//Login Controller
exports.login = async (req, res) => {
  try {
   
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not registered. Please sign up." });
    }

    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    user.token = token;
    user.password = undefined;

    console.log("NODE_ENV:", process.env.NODE_ENV);

    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      //secure: process.env.NODE_ENV === "production",
      secure:true,
      sameSite: "None",
    };
    // Detect if request is from browser
    const isBrowser = req.headers['user-agent']?.includes("Mozilla");
    if (isBrowser) {
      res.cookie("token", token, options);
    }
    res.status(200).json({
      success: true,
      token,
      user,
      message: "Login successful",
    });
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Login failed. Please try again." });
  }
};



exports.sendotp = async (req, res) => {
  try {
    const { email, role } = req.body;
    console.log("Incoming OTP request:", { email, role });

    if (!email || !role) {
      console.warn("Missing email or accountType");
      return res.status(400).json({ success: false, message: "Email and account type are required" });
    }

    if (role.toLowerCase() === "admin") {
      const existingAdmin = await User.findOne({ role: { $regex: /^admin$/i } });
      console.log("Admin check:", existingAdmin ? "Admin exists" : "No admin found");
      if (existingAdmin) {
        return res.status(403).json({ success: false, message: "Admin account already exists. OTP not allowed." });
      }
    }

    const existingUser = await User.findOne({ email });
    console.log("User check:", existingUser ? "User exists" : "User not found");
    if (existingUser) {
      return res.status(401).json({ success: false, message: "User already registered" });
    }

    let otp;
    let result;
    let attempts = 0;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
      attempts++;
    } while (result && attempts < 5);
    console.log("Generated OTP:", otp);

    try {
      const newOtp = new OTP({ email, otp });
      await newOtp.save();
      console.log("OTP saved to DB and email hook triggered");
    } catch (dbError) {
      console.error("OTP DB save error:", dbError);
      return res.status(500).json({ success: false, message: "Failed to save OTP to database" });
    }

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Unhandled sendotp error:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};



