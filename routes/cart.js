import express from "express";

import {
  handleAddToCart,
  handleGetCartItems,
  handleDeleteCartItem,
} from "../controllers/cart.js";
import { protectRoute } from "../controllers/auth.js";

const route = express.Router();

route.post('/add/:productId',protectRoute,handleAddToCart)
route.get('/getCartItems',protectRoute,handleGetCartItems)
route.delete('/deleteItem/:productId',protectRoute,handleDeleteCartItem)

export default route;