import catchAsync from "../utils/catchAsync.js";
import User from '../models/user.js'
import jsonwebtoken from "jsonwebtoken";

export const createUser = catchAsync(async (req,res,next) => {
    console.log('hello')
    delete req.body.role;
    const user = await User.create(req.body);
    const jwt = jsonwebtoken.sign(user,process.env.JWTSECRET,{expiresIn:7});
    res.status(201).json({status:'success',user,jwt});
})