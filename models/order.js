import mongoose from "mongoose";
const schema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  rated:{
    type:Boolean,
    default:false
  },
  ratingDate:Date,
  comment:String,
  rating:Number,
  email:String,
  customerName:String,
  phoneNumber:String,
  productName:String,
  quantity:Number,
  instructions:String,
  description:String,
  coverImage:String,
  subTotal:Number,
  discount:Number,
  deliveryCharges:Number,
  totalAmount:Number,
  address:{
    line1:String,
    line2:String,
    city:String,
    state:String,
    pincode:String,
    country:String
  },
  status:{
    type:String,
    default:'processing',
    enum:['processing','shipped','delivered','cancelled']
  },
  deliveryExpected:Date,
},{timestamps:true});

const model = mongoose.model("Order", schema);

export default model;
