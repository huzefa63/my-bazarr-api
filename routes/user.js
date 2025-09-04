import express from "express";

import {
  createUser,
} from "../controllers/user.js";
import { protectRoute } from "../controllers/auth.js";
import { verifyOtp } from "../controllers/otp.js";

const route = express.Router();

// otp for 

route.post("/createUser", verifyOtp ,createUser);
// route.get("/getUser", protectRoute, getUser);
// route.patch(
//   "/updateUser",
//   protectRoute,
//   upload.single("photo"),
//   resizeImage,
//   UpdateUser
// );
// route.delete("/deleteUser", protectRoute, DeleteUser);
// route.delete("/profileImage", protectRoute, deleteProfileImage);
// route.patch("/updatePassword", protectRoute, updatePassword);
export default route;
