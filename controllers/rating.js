import mongoose from 'mongoose';
import Rating from '../models/rating.js';
import Order from '../models/order.js';
import Product from '../models/product.js';
import catchAsync from '../utils/catchAsync.js';

export const createRating = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.params;
  const {comment,rating,orderId,ratingDate} = req.body;
  await Rating.create({product:productId,rating,rater:id,comment});
  await Order.findByIdAndUpdate(orderId,{rated:true,rating,ratingDate,comment});
  const totalRatings = await Rating.find({product:productId});
  const ratingsCounts = totalRatings.length;
  const avgRating = totalRatings.reduce((acc,curr) => acc + curr.rating,0) / ratingsCounts;
  await Product.findByIdAndUpdate(productId,{ratingsAvg:avgRating});
  res.status(201).json({ ok:true });
});

export const getRatings = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const {productId} = req.params;
    const reviews = await Rating.find({product:productId}).populate('rater');
  res.status(200).json({ ok:true,reviews});
});
export const getAvgRatings = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const {productId} = req.params;
    // const avgRating = await Rating.aggregate([
    //   {
    //     $match: { product: new mongoose.Types.ObjectId(productId) },
    //   },
    //   {
    //     $group: {
    //       _id: "$product",
    //       ratingsAvg: {
    //         $avg: "$rating",
    //       },
    //       totalRatings: { $sum: 1 },
    //     },
    //   },
    // ]);
    const eachAvgRating = await Rating.aggregate([
      {
        $match: { product: new mongoose.Types.ObjectId(productId) },
      },
      {
        $group: {
          _id: "$rating",
          totalRatings: {
            $sum: 1,
          },
        },
      },
      {
        $project:{
          rating:'$_id',
          value:'$totalRatings'
        }
      },
      {
        $sort:{
            rating:-1
        }
      },
    ]);
    
  res.status(200).json({ok:true,eachAvgRating});
});





