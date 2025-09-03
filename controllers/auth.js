import AppError from '../utils/appError.js';
import User from '../models/user.js';
import jsonwebtoken from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';

export const protectRoute = catchAsync(async (req, res, next) => {
  const cookie = req.cookies.token;
  if (!cookie)
    return next(new AppError("you are not logged in, please login", 401));

  const decoded = await util.promisify(jsonwebtoken.verify)(
    cookie,
    process.env.JWT_SECRET
  );

  // check if user exists
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError("user not found", 401));

  // check if user changed password after token was issued
  if (user.changedPasswordAt) {
    const passwordChangedAt = parseInt(
      user.changedPasswordAt.getTime() / 1000,
      10
    );
    if (passwordChangedAt > decoded.iat)
      return next(
        new AppError("you have recently changed password, please login", 401)
      );
  }
  req.user = user;
  next();
});