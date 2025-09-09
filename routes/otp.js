import express from "express";

import { sendDeliveryOtp, sendOtp, verifyDeliveryOtp } from "../controllers/otp.js";

const route = express.Router();

route.post('/sendOtp',sendOtp)
route.post('/sendDeliveryOtp',sendDeliveryOtp)
route.post('/verifyDeliveryOtp',verifyDeliveryOtp)

export default route;