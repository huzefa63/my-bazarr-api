import express from "express";
import upload from "../libs/multer.js";
import { handleUploadProduct, resizeImages } from "../controllers/product.js";
import { protectRoute } from "../controllers/auth.js";

const route = express.Router();


route.post("/uploadProduct",protectRoute, upload.fields([
    {name:'cover',maxCount:1},
    {name:'images',maxCount:4},
]),resizeImages,handleUploadProduct);

export default route;
