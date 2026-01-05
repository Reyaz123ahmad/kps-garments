const Product = require("../models/ProductModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createProducts = async (req, res) => {
  try {
    const { name, description, price, size } = req.body;

    // Validate required fields
    if (!name || !description || !size || !price) {
      return res.status(400).json({
        success: false,
        message: "All Fields Required",
      });
    }

    // Check if image file is provided
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const imageFile = req.files.image;

    // Upload image to Cloudinary
    const uploadResponse = await uploadImageToCloudinary(imageFile, "products");

    // Create product with Cloudinary image URL
    const newProduct = await Product.create({
      name,
      description,
      price,
      size,
      image: uploadResponse.secure_url, // Cloudinary ka URL
    });

    return res.status(201).json({
      success: true,
      data: newProduct,
      message: "Product Created Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// get all products
exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({}).populate('users').exec()
    
    if(!allProducts || allProducts.length===0){
        return res.status(400).json({
            success:false,
            message:"No Products Found"
        })
    }
    return res.status(200).json({
      success: true,
      data: allProducts,
      message: "Products Fetched Successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Can't Fetch Products Data",
      error: error.message,
    });
  }
};

// get product by id
exports.getProductById = async (req, res) => {
  try {
    const {productId}=req.params
    const existingProduct = await Product.findById(productId).populate('users').exec()
    
    if(!existingProduct){
        return res.status(400).json({
            success:false,
            message:"Product Not Found"
        })
    }
    return res.status(200).json({
      success: true,
      data: existingProduct,
      message: "Product Fetched Successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Can't Fetch Product Data",
      error: error.message,
    });
  }
};

// update product 
exports.updateProduct=async(req, res)=>{
    try{
        const {productId}=req.params;
        if(!productId){
            return res.status(400).json({
                success:false,
                message:"Product id missing or mismatch"
            })
        }
        const {name, description, size, price}=req.body;
        
        const updatedProduct=await Product.findByIdAndUpdate(
            productId,{name, description, price, size},{new: true}
        )

        return res.status(200).json({
            success:true,
            message:"Product Updated Successfully",
            data:updatedProduct
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
        success: false,
        message: "Can't Update Product Data",
        error: error.message,
        });
    }
}

// delete product
exports.deleteProduct=async(req, res)=>{
    try{
        const {productId}=req.params;
        if(!productId){
            return res.status(400).json({
                success:false,
                message:"Product Id Missing or Mismatch"
            })
        }
        const deletedProduct=await Product.findByIdAndDelete(productId)
        return res.status(200).json({
            success:true,
            message:"Product Deleted Succesfully",
            data:deletedProduct
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
        success: false,
        message: "Can't Delete Product",
        error: error.message,
        });
    }
}