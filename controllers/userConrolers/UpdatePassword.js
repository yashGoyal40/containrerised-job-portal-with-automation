import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { User } from "../../models/userSchema.js";
import { sendToken } from "../../utils/jwtToken.js";

export const updatePasswrod = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const isPasswordisMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordisMatched) {
    return next(new ErrorHandler("current password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("confirm Password does not match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res, "Password updated successfully");
});
