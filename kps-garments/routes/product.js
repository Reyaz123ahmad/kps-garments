const express = require("express");
const router = express.Router();

const {
  createProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/Product");

const { auth, isOwner } = require("../middlewares/auth");



// ********************************************************************************************************
//                                      Appointment routes
// ********************************************************************************************************

router.post("/createProducts", auth, isOwner, createProducts);
router.get("/getAllProducts", auth, getAllProducts);
router.get("/getProductById/:productId", auth, getProductById);
router.put("/updateProduct/:productId", auth, isOwner, updateProduct);
router.delete("/deleteProduct/:productId", auth, isOwner, deleteProduct);





module.exports = router;
