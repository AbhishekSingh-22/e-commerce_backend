/* *************************************************************************************************************
*******************main js file where server lives and which runs on start (entry point of the project)**********
************************************************************************************************************** */

import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import morgan from "morgan";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger/swaggerConfig.js';


const app = express();

const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan('dev'));



import authRoutes     from './routes/auth.route.js';
import productRoutes  from './routes/product.route.js';

app.use('/api/v1/auth',    authRoutes);
app.use('/api/v1/products', productRoutes);

// swagger endpoint
app.use('/api-docs', (req, res, next) => {
  swaggerSpec.servers = [
    {
      url: `${req.protocol}://${req.get('host')}`,
    },
  ];
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB()
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
    })
}) .catch( (err) => {
    console.log("MONGODB connection Failed: ", err);
});
