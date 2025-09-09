import express from "express";

import {
  createRating,
  getAvgRatings,
  getRatings
} from "../controllers/rating.js";
import { protectRoute } from "../controllers/auth.js";

const route = express.Router();

route.post('/createRating/:productId',protectRoute,createRating)
route.get('/getReviews/:productId',protectRoute,getRatings)
route.get('/getAvgRatings/:productId',protectRoute,getAvgRatings)

export default route;