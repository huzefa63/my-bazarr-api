import catchAsync from "../utils/catchAsync.js";

export const getSearch = catchAsync(async (req, res, next) => {
  const {search} = req.params;
});
