import catchAsync from "../utils/catchAsync.js";
import Cart from "../models/cart.js";

export const handleAddToCart = catchAsync(async (req,res,next) => {
    console.log('heyy')
    const {productId} = req.params;
    const {id} = req.user;
    await Cart.findOneAndUpdate({user:id},{$addToSet:{items:productId}})
    res.status(201).json({message:'success'});
})

export const handleGetCartItems = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const cart = await Cart.findOne({user:id}).populate('items');
    res.status(201).json({message:'success',cartItems:cart.items,totalItems:cart.items.length});
})

export const handleDeleteCartItem = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const {productId} = req.params
    await Cart.findOneAndUpdate({user:id},{$pull:{items:productId}});
    res.status(200).json({message:'success'});
})

export const handleCheckoutCart = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    
})
