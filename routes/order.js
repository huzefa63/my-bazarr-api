import express from "express";

import {
  createOrder,
  handleGetAllOrders,
  handleGetOrder,
  handleCheckoutOrder,
} from "../controllers/order.js";
import { protectRoute } from "../controllers/auth.js";

const route = express.Router();

route.post('/createOrder',protectRoute,createOrder)
route.get('/getAllOrders',protectRoute,handleGetAllOrders);
route.get('/getOrder/:orderId',protectRoute,handleGetOrder);
route.post('/orderCheckout',protectRoute,handleCheckoutOrder);

export default route;