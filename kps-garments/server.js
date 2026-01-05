const express =  require('express');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes=require('./routes/user');
const productRoutes=require('./routes/product')
const cartRoutes=require('./routes/cartRoutes')
const orderRoutes=require('./routes/orderRoutes')
const paymentRoutes=require('./routes/paymentRoutes')
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const database = require("./config/db");

dotenv.config();
const PORT = process.env.PORT;


//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://127.0.0.1:5173', 
      'https://hospital-management-forntend.vercel.app'
    ];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  
  credentials: true
}));

// app.options("*", cors());


app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);

//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})