import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { User } from "../../models/userSchema.js";
import { sendToken } from "../../utils/jwtToken.js";

export const verifyUser = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Email and OTP are required", 400));
  }

  const user = await User.findOne({ email }).select("+otp +otpExpires");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.isVerified) {
    return next(new ErrorHandler("User is already verified", 400));
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  sendToken(user, 200, res, "User Registered and verified succesfully");
});

