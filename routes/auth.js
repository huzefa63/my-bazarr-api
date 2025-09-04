import express from "express";

import {verifyOtp} from "../controllers/otp.js";
import {handleLogin} from "../controllers/auth.js";

const route = express.Router();

route.post('/login',verifyOtp,handleLogin);

export default route;