import sharp from "sharp";
import catchAsync from "../utils/catchAsync.js";
import { Readable } from "stream";
import cloudinary from "../libs/cloudinary.js";
import Product from "../models/product.js";
import Rating from "../models/rating.js";
import mongoose from "mongoose";

export const resizeImages = catchAsync(async (req, res, next) => {
  // console.log('filter here')
  // console.log(req.files)
  if (!req.files?.cover.length > 0 || !req.files?.images.length > 0)
    return res.status(400).json({ message: "please provide images" });
  const coverImage = await sharp(req.files.cover[0].buffer)
    .resize(820,450,{fit:'cover'})
    .jpeg({ quality: 90 })
    .toBuffer();
  const readable = new Readable();
  readable.push(coverImage);
  readable.push(null);

  const stream = cloudinary.uploader.upload_stream(
    { resource_type: "auto", folder: "my-bazarr/products" },
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "unable to upload image now" });
      req.body.coverImage = result.secure_url;
    }
  );

  readable.pipe(stream);
  req.body.images = await Promise.all(
    req.files.images.map(async (image) => {
      const resizedImage = await sharp(image.buffer)
        .resize(820, 450,{fit:'cover'})
        .jpeg({ quality: 90 })
        .toBuffer();
      return new Promise((resolve, reject) => {
        const readable = new Readable();
        readable.push(resizedImage);
        readable.push(null);
        const streamImages = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "my-bazarr/products" },
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ message: "unable to upload image now" });
            resolve(result.secure_url);
          }
        );
        readable.pipe(streamImages);
      });
    })
  );
  next();
});

export const handleUploadProduct = catchAsync(async (req, res, next) => {
  const { name, price, description, category, about } = req.body;
  const id = req.user.id;
  await Product.create({name,price,description,about,category,seller:id,coverImage:req.body.coverImage,images:req.body.images});
  res.status(201).json({message:'success'});
});

export const handleDeleteProduct = catchAsync(async (req, res, next) => {
  const {productId} = req.params;
  await Product.findByIdAndDelete(productId);
  res.status(201).json({ok:true});
});

export const handleGetMyProducts = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  console.log('myrsdfjd')
  const products = await Product.find({seller:id})
  res.status(200).json({message:'success',products});
});

export const handleGetProductDetails = catchAsync(async (req, res, next) => {
  const {productId} = req.params
  const product = await Product.findById(productId).populate('seller');
  const commentsCount = await Rating.countDocuments({product:productId});

  const avgRating = await Rating.aggregate([
    {
      $match: { product: new mongoose.Types.ObjectId(productId) },
    },
    {
      $group: {
        _id: "$product",
        ratingsAvg: {
          $avg: "$rating",
        },
        totalRatings: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json({ message: "success", product,avgRating,commentsCount });
});

export const handleGetProducts = catchAsync(async (req, res, next) => {
  // const products
  // const totalResults 
  const [products,totalResults] = await Promise.all([
    await Product.find(),
    await Product.countDocuments()
  ])
  res.status(200).json({ message: "success", products, totalResults });
});

export const handleGetProductMetricDetails = catchAsync(async (req, res, next) => {
  const {productId} = req.params;
  const productDetails = await Product.findById(productId);
  res.status(200).json({ message: "success", productDetails });
});
