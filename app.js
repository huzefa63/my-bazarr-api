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

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


export default app;