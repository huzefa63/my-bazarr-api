import catchAsync from "../utils/catchAsync.js";
import User from '../models/user.js'
import Cart from '../models/cart.js'
import jsonwebtoken from "jsonwebtoken";
import SendJwt from "../helpers/jwt.js";




export const createUser = catchAsync(async (req,res,next) => {
    delete req.body.role;
    const {email,username} = req.body;
   
    const user = await User.create({email,username});
    const jwt = jsonwebtoken.sign({name:user.username,id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:7});

      SendJwt(res,201,user,{message:'success',signedUp:true})
})

export const getUser = catchAsync(async (req,res,next) => {
  console.log('hee') 
   const {id} = req.user;
   const user = await User.findById(id);
   const cart = await Cart.findOne({user:id});
   res.status(200).json({message:'success',user,cartItems:cart.items});
})