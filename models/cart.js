import mongoose from "mongoose";
const schema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true,
  },
  items:[{type:mongoose.Schema.Types.ObjectId,ref:'Product'}]
});

const model = mongoose.model('Cart',schema); 

export default model;