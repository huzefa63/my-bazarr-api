import express from "express";

import {
  createUser,
  getUser
} from "../controllers/user.js";
import { protectRoute } from "../controllers/auth.js";
import { verifyOtp } from "../controllers/otp.js";

const route = express.Router();


route.post("/createUser", verifyOtp ,createUser);
route.get("/getUser", protectRoute ,getUser);

export default route;
