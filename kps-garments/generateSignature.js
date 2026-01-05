const crypto = require("crypto");

const orderId = "order_RcMIFgj723kbHU"; // Razorpay se mila
const paymentId = "pay_test123456"; // Tu manually bana raha hai
const secret = "SmNG2ZsWNXVKPfROOZzQII1a"; // Razorpay test secret

const signature = crypto
  .createHmac("sha256", secret)
  .update(`${orderId}|${paymentId}`)
  .digest("hex");

console.log("Signature:", signature);
