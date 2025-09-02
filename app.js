import { config } from "dotenv";
config({ path: "./.env" });

// module imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// // custom imports
// import userRoutes from "./routes/user.js";
// import transactionRoutes from "./routes/transaction.js";
// import authRoutes from "./routes/auth.js";
// import categoriesRoutes from "./routes/categories.js";
// import globalErrorHandler from "./controllers/error.js";
// import Transaction from "./models/transaction.js";
// import { faker } from "@faker-js/faker";

const app = express();

app.use(
  cors({ origin: "https://my-bazarr-app.vercel.app", credentials: true })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/cookie',(req,res) => {
    console.log('req came');
    res.cookie("jwt", "let'see if it persists", {
      httpOnly: true, // Protect from JavaScript access
      secure: true, // Required for HTTPS
      sameSite: 'none', // Allow cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }).status(200).json({status:'success',mess:'cookie sent'});
})
export default app;