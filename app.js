import { config } from "dotenv";
config({ path: "./.env" });

// module imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import OtpRoutes from "./routes/otp.js";
import productRoutes from "./routes/product.js";
const app = express();

// Initialize Resend with API key from .env

app.use(cors({ origin: process.env.ENVIROMENT === 'production' ?"http://localhost:3000":'https://www.my-bazarr.in', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// user routes

app.use('/user',userRoutes);
app.use('/auth',authRoutes);
app.use('/otp',OtpRoutes);
app.use('/product',productRoutes);



// res.cookie("randomCookie", randomValue, {
//   domain: ".my-bazarr.in", // makes cookie available on all subdomains
//   path: "/",
//   httpOnly: true,
//   secure: true, // frontend must be HTTPS
//   sameSite: "None", // required for cross-site
//   maxAge: 1000 * 60 * 60, // 1 hour
// }).status(200).send("hello");


export default app;
