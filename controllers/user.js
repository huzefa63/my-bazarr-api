import catchAsync from "../utils/catchAsync.js";
import User from '../models/user.js'
import jsonwebtoken from "jsonwebtoken";
import resend from "../libs/resend.js";
import AppError from "../utils/appError.js";
import crypto from "crypto";
import Otp from '../models/otp.js'
import SendJwt from "../helpers/jwt.js";




export const createUser = catchAsync(async (req,res,next) => {
    delete req.body.role;
    const {email,username} = req.body;
   
    const user = await User.create({email,username});
    const jwt = jsonwebtoken.sign({name:user.username,id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:7});

      SendJwt(res,201,user,{message:'success',signedUp:true})
})





