import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Seller/User
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String, // URL or path
      required: true,
    },
    images: {
      type: [String], // Array of image URLs/paths
      validate: [
        (arr) => arr.length === 4,
        "Exactly 4 images required",
      ],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    ratingsAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
