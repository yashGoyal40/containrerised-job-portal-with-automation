import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { User } from "../../models/userSchema.js";
import { sendToken } from "../../utils/jwtToken.js";
import { PasswordResetRequest } from "../../models/passwordResetRequestSchema.js";

export const passwordReset = catchAsyncErrors(async (req, res, next) => {
  const { otp, newPassword, confirmPassword } = req.body;

  if (!otp || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please Provide complete details", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New password and confirm password do not match", 400)
    );
  }

  const otpDetails = await PasswordResetRequest.findOne({ otp });

  if (!otpDetails) {
    return next(new ErrorHandler("Please enter correct otp", 400));
  }

  if (otpDetails.otpExpires < Date.now()) {
    return next(new ErrorHandler("OTP has expired", 400));
  }

  const user = await User.findById(otpDetails.userId).select("+password");


  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  
  const isPassworSame = await user.comparePassword(newPassword);

  if(isPassworSame){
    return next(new ErrorHandler("the password is already same",400))
  }

  user.password = newPassword;
  await user.save();

  await PasswordResetRequest.deleteOne({ otp });

  sendToken(user, 200, res, "Password reset successful");

});
