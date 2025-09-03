import { compare, hash } from "bcrypt";
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
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  passwordConfirm: {
    type: String,
    required: true,
    minlength: 6,
    validate:  {
        validator: function(val)  {
            return val === this.password
        },
        message : "password didn't match"
    }
  },
  passwordChangedAt:{
    type:Date,
  }
},{timestamps:true});

schema.pre("save", async function(next) {
    if(!this.isModified('password')) return next();
    const hashedPass = await hash(this.password,10)
    this.password = hashedPass;
    this.passwordConfirm = null;
})

schema.method.checkPassword = async (providedPass,currentPass) => {
    return await compare(providedPass,currentPass);
}

const model = mongoose.model('User',schema); 

export default model;