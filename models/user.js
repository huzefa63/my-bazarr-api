import { config } from "dotenv";
config();
import mongoose from "mongoose";
import val from "validator";
import Cart from '../models/cart.js'
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 3,
      required: true,
    },
    profileImage: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      validate: [val.isEmail, "please provide a valid email"],
    },
    customerId:String,
    
  },
  { timestamps: true }
);


schema.post('save',async function(){
  await Cart.create({user:this._id});
})

schema.pre('save',async function(next){
  const customer = await stripe.customers.create({
    email:this.email,
    name:this.username,
    metadata:{
      userId:`${this._id}`
    }
  })
  this.customerId = customer.id;
  next();
})

const model = mongoose.model('User',schema); 

export default model;