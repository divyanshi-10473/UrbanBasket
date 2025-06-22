const express=require('express')
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser')
const cors=require('cors')
const authRouter =require('./routes/auth/auth-routes')
const adminProductRouter = require('./routes/admin/product-routes')
const shopProductRouter = require('./routes/shop/product-routes')
const shopCartRouter = require('./routes/shop/cart-routes')
const addressRouter = require('./routes/shop/address-routes')
const shopOrderRouter = require('./routes/shop/order-routes')
const adminOrderRouter = require('./routes/admin/order-routes')
const shopSearchRouter = require('./routes/shop/search-routes')
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(  process.env.MONGODB_URI)
   .then(()=>console.log("connected to database"))
    .catch((error)=> console.log(error))
  
const app=express()
const PORT=process.env.PORT || 5000;

const allowedOrigins = [
  process.env.BASE_URL,             // your deployed frontend (Render)
  "http://localhost:5173"           // local dev frontend
];

app.use(
    cors({
        origin: allowedOrigins ,
        methods: ['GET','POST','DELETE','PUT'],
        allowedHeaders:[
            "Content-Type",
            "Authorization",
            'Cache-Control',
            'Express',
            'Pragma'
        ],
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth',authRouter);
app.use('/api/admin/products', adminProductRouter)
app.use('/api/admin/orders', adminOrderRouter)
app.use('/api/shop/products', shopProductRouter)
app.use('/api/shop/cart', shopCartRouter)
app.use('/api/shop/address', addressRouter)
app.use('/api/shop/order', shopOrderRouter)
app.use('/api/shop/search', shopSearchRouter)
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT,()=>
    console.log(`server is running on port ${PORT}`)
)
