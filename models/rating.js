import mongoose from "mongoose";
const schema = new mongoose.Schema({
    rating:{
        type:Number,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
    rater:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }
},{timestamps:true});

const model = mongoose.model('Rating',schema); 

export default model;