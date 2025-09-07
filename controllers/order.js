import Order from '../models/order.js';
import catchAsync from "../utils/catchAsync.js";

export const createOrder = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const {order} = req.body;
    const newOrder = await Order.create({...order,user:id});
    res.status(200).json({message:'success'});
})

export const handleGetAllOrders = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const orders = await Order.find({customer:id});
    res.status(200).json({ok:true,orders});
    
})

export const handleGetOrder = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const {orderId} = req.params;
    const order = await Order.findById(orderId);
    res.status(200).json({ok:true,order});
})