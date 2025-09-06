import mongoose from "mongoose";
import val from "validator";
import Cart from '../models/cart.js'
const schema = new mongoose.Schema({
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
},{timestamps:true});


schema.post('save',async function(next){
  await Cart.create({user:this._id});
  next();
})

const model = mongoose.model('User',schema); 

export default model;