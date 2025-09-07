import express from "express";

import {
  handleAddToCart,
  handleGetCartItems,
  handleDeleteCartItem,
  handleCheckoutCart,
} from "../controllers/cart.js";
import { protectRoute } from "../controllers/auth.js";

const route = express.Router();

route.post('/add/:productId',protectRoute,handleAddToCart)
route.post('/checkout',protectRoute,handleCheckoutCart)
route.get('/getCartItems',protectRoute,handleGetCartItems)
route.delete('/deleteItem/:productId',protectRoute,handleDeleteCartItem)

export default route;