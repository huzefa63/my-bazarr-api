import express from "express";

import {verifyOtp} from "../controllers/otp.js";
import {handleLogin,handleLogout} from "../controllers/auth.js";

const route = express.Router();

route.post('/login',verifyOtp,handleLogin);
route.get('/logout',handleLogout);

export default route;