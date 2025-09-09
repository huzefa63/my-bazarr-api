import express from "express";
import { getSearch } from "../controllers/search.js";

const route = express.Router();

route.get('/getSearch/:search',getSearch)

export default route;
