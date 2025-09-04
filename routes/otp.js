import express from "express";

import { sendOtp } from "../controllers/otp.js";

const route = express.Router();

route.post('/sendOtp',sendOtp)

export default route;