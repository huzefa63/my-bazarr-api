import express from "express";

import {
  createOrder,
  handleGetAllOrders,
  handleGetOrder,
} from "../controllers/order.js";
import { protectRoute } from "../controllers/auth.js";

const route = express.Router();

route.post('/createOrder',protectRoute,createOrder)
route.get('/getAllOrders',protectRoute,handleGetAllOrders);
route.get('/getOrder/:orderId',protectRoute,handleGetOrder);

export default route;