import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const User = req.user;
  res.status(200).json({
    success: true,
    User,
  });
});