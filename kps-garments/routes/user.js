const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendotp,
  
} = require('../controllers/auth');




const { authLimiter } = require("../service/rateLimiting")
// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

router.post("/login", authLimiter, login);
router.post("/signup", signup);
router.post("/sendotp", sendotp);




module.exports = router;
