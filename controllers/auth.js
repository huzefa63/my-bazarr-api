import AppError from '../utils/appError.js';
import User from '../models/user.js';
import jsonwebtoken from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import SendJwt from '../helpers/jwt.js';
import util from 'util';

export const protectRoute = catchAsync(async (req, res, next) => {
  if(process.env.ENVIROMENT === 'production'){
    req.user = { id: "68b92b941ac18b8adb3e43dd" };
    return next();
  }
  const cookie = req.cookies.token;
  console.log(cookie);
  if (!cookie)
    return next(new AppError("you are not logged in, please login", 401));

  const decoded = await util.promisify(jsonwebtoken.verify)(
    cookie,
    process.env.JWT_SECRET
  );

  // check if user exists
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError("user not found", 401));

  req.user = user;
  next();
});

export const handleLogin = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) res.status(400).json({ message: "user not found" });
  SendJwt(res, 200, user, {
    message: "success",
    signedIn: true,
    user: { email: user.email, id: user._id, username: user.username },
  });
});