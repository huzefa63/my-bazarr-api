import catchAsync from "../utils/catchAsync.js";
import Otp from "../models/otp.js";
import crypto from 'crypto';
import { sendOtpEmail } from "../helpers/email.js";
import resend from "../libs/resend.js";
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

export const verifyDeliveryOtp = catchAsync(async (req, res, next) => {
  const { otp, email } = req.body;
  if (!otp || !email)
    return res.json({ status: "please provide otp to verify" });
  const isOtp = await Otp.findOne({ email, otp });
  if (!isOtp) return res.status(400).json({ message: "invalid" });
  if (new Date(isOtp.expiresAt) < new Date(Date.now()))
    return res.status(400).json({ message: "expired" });
  res.status(200).json({ok:true});
});

export const sendDeliveryOtp = catchAsync(async (req, res, next) => {
  const { customerEmail } = req.body;
  if (!customerEmail) return next(new AppError("please provide valid email", 400));
  const otp = generateSecureOTP();
  const createdOTP = await Otp.create({ email:customerEmail, otp });
  await resend.emails.send({
    from: "MyBazar <hello@my-bazarr.in>", // use your verified domain
    to:customerEmail, // customer's email
    subject: "Your Delivery Verification Code",
    html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Delivery Verification Code</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h2 style="color: #333;">Delivery Verification</h2>
                  <p style="color: #555; font-size: 15px;">
                    Dear Customer,<br /><br />
                    Please use the following One-Time Password (OTP) to confirm that you have received your order:
                  </p>

                  <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #2c3e50; margin: 20px 0;">
                    ${otp}
                  </p>

                  <p style="color: #555; font-size: 14px;">
                    This code will expire in <strong>10 minutes</strong>.<br />
                    Share it only with the delivery person.
                  </p>

                  <p style="margin-top: 30px; font-size: 13px; color: #777;">
                    Thank you for shopping with us.<br />
                    – The My-Bazarr Team
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
  });
  res.status(200).json({ emailSent: true });
});