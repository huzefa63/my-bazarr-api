import mongoose from "mongoose";
import val from "validator";
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


const model = mongoose.model('User',schema); 

export default model;