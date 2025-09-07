import mongoose from "mongoose";
const schema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
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
  payment:{
    type:String,
    enum:['pending','paid','failed'],
    default:'pending'
  },
  deliveryExpected:Date,
},{timestamps:true});

const model = mongoose.model("Order", schema);

export default model;
