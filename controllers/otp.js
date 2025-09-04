import catchAsync from "../utils/catchAsync.js";
import Otp from "../models/otp.js";
import User from "../models/user.js";
import SendJwt from "../helpers/jwt.js";
import crypto from 'crypto';
import { sendOtpEmail } from "../helpers/email.js";

function generateSecureOTP(length = 6) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randIndex = crypto.randomInt(0, digits.length);
    otp += digits[randIndex];
  }
  return otp;
}

export const verifyOtp = catchAsync(async (req, res, next) => {
    const {otp,email} = req.body;
    if(!otp || !email) return res.json({status:'please provide otp to verify'});
    const isOtp = await Otp.findOne({ email, otp });
    if (!isOtp) return res.status(400).json({ message: "invalid" });
    if (new Date(isOtp.expiresAt) < new Date(Date.now())) return res.status(400).json({ message: "expired" });
    next();
});

export const sendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("please provide valid email", 400));

  const otpExists = await Otp.find({ email });
  console.log(otpExists);
  if (otpExists.length > 0) {
    await Otp.deleteMany({ email });
  }

  const otp = generateSecureOTP();
  const createdOTP = await Otp.create({ email, otp });

  await sendOtpEmail(email, otp);
  res.status(200).json({ emailSent: true });
});