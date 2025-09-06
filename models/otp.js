import mongoose from "mongoose";
import validator from 'validator';
const schema = new mongoose.Schema({
    email:{
        type:String,
        validate:[validator.isEmail,'please provide a valid email']
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    expiresAt:{
        type:Date,
        default:() => new Date(Date.now() + 5 * 60 * 1000)
    }
});

const model = mongoose.model('Otp',schema); 

export default model;