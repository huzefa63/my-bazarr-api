import app from "./app.js";
import mongoose from "mongoose";


(async function(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('db connected');
    }
    catch(err){
        console.log('failed to connect db');
    }
})()


app.listen(process.env.PORT, () => {
    console.log('listening on port: ',process.env.PORT);
})