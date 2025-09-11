import express from "express";
import { getSearch } from "../controllers/search.js";

const route = express.Router();

route.get('/getSearch',getSearch)

export default route;
