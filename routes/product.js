import express from "express";
import upload from "../libs/multer.js";
import {
  handleUploadProduct,
  resizeImages,
  handleGetMyProducts,
  handleGetProductDetails,
  handleGetProducts,
  handleDeleteProduct,
} from "../controllers/product.js";
import { protectRoute } from "../controllers/auth.js";

const route = express.Router();


route.post("/uploadProduct",protectRoute, upload .fields([
    {name:'cover',maxCount:1},
    {name:'images',maxCount:4},
]),resizeImages,handleUploadProduct);

route.get('/getMyProducts',protectRoute,handleGetMyProducts)
route.delete('/deleteProduct/:productId',protectRoute,handleDeleteProduct)
route.get('/getProductDetails/:productId',handleGetProductDetails)
route.get('/getProducts',handleGetProducts)

export default route;
