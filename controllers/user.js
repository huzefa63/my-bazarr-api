import catchAsync from "../utils/catchAsync.js";
import User from '../models/user.js'
import jsonwebtoken from "jsonwebtoken";
import resend from "../libs/resend.js";
import AppError from "../utils/appError.js";
import crypto from "crypto";
import Otp from '../models/otp.js'

function generateSecureOTP(length = 6) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randIndex = crypto.randomInt(0, digits.length);
    otp += digits[randIndex];
  }
  return otp;
}


export const createUser = catchAsync(async (req,res,next) => {
    console.log('hello')
    delete req.body.role;
    const {email,username,otp} = req.body;
    const isOtp = await Otp.findOne({email,otp});
    if(!isOtp) return res.status(400).json({message:'invalid'});
    if(new Date(isOtp.expiresAt) < new Date(Date.now())) return res.status(400).json({message:'expired'})
    const user = await User.create({email,username});
    console.log(user)
    const jwt = jsonwebtoken.sign({name:user.username,id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:7});
    res.cookie("token", jwt, {
        domain: ".my-bazarr.in", // makes cookie available on all subdomains
        path: "/",
        httpOnly: true,
        secure: true, // frontend must be HTTPS
        sameSite: "None", // required for cross-site
        maxAge: 1000 * 60 * 60, // 1 hour
      })
      .status(201).json({status:'success',signedUp:true});
})

export const verifyEmail = catchAsync(async (req,res,next) => {
  const {email} = req.body;
    if(!email) return next(new AppError('please provide valid email',400));

    const otpExists = await Otp.find({email});
    console.log(otpExists)
    if(otpExists.length > 0) {
      await Otp.deleteMany({email})
    }

     const otp = generateSecureOTP();
     const createdOTP = await Otp.create({ email, otp });

     await sendOtpEmail(email,otp);
    res.status(200).json({emailSent:true});
  
})


async function sendOtpEmail(email,otp){
  
   await resend.emails.send({
      from: "My-Bazarr <hello@my-bazarr.in>", // must be a verified sender
      to: email, // user’s email
      subject: "Your My-Bazarr OTP Code",
      text: `Hello!\n\nYour OTP code is: ${otp}\n\nIt will expire in 5 minutes.\n\nIf you did not request this, please ignore this email.`,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2 style="color:#2c3e50;">Verify Your Email</h2>
      <p>Hello,</p>
      <p>Your OTP code is:</p>
      <p style="font-size:22px; font-weight:bold; color:#3498db; letter-spacing: 3px;">
        ${otp}
      </p>
      <p style="margin-top: 15px;">This code will expire in <b>5 minutes</b>.</p>
      <hr style="margin: 20px 0;" />
      <p style="font-size:14px; color:#888;">
        If you did not request this OTP, you can safely ignore this email.<br />
        Need help? Contact us: 
        <a href="mailto:support@my-bazarr.in">support@my-bazarr.in</a>
      </p>
    </div>
  `,
    });
}