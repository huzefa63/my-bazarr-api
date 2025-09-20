import express from "express";

import {
  createOrder,
  handleGetAllOrders,
  handleGetOrder,
  handleCheckoutOrder,
  handleGetAllSellerOrders,
  handleShipOrder,
  handleCancelOrder,
  handleOrderDelivered,
  updateOrder,
  handleGetAllItemOrders,
} from "../controllers/order.js";
import { protectRoute } from "../controllers/auth.js";

const route = express.Router();

route.post('/createOrder',protectRoute,createOrder)
route.post('/update/:orderId',protectRoute,updateOrder)
route.get('/getAllOrders',protectRoute,handleGetAllOrders);
route.get('/getAllSellerOrders',protectRoute,handleGetAllSellerOrders);
route.get('/getOrder/:orderId',protectRoute,handleGetOrder);
route.get('/getAllItemOrders/:productId',protectRoute,handleGetAllItemOrders);
route.post('/orderCheckout',protectRoute,handleCheckoutOrder);
route.post('/orderShipped/:orderId',protectRoute,handleShipOrder);
route.post('/cancelOrder/:orderId',protectRoute,handleCancelOrder);
route.post('/orderDelivered/:orderId',protectRoute,handleOrderDelivered);

export default route;