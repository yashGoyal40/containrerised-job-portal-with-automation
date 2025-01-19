import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { User } from "../../models/userSchema.js";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendMail.js";
import { PasswordResetRequest } from "../../models/passwordResetRequestSchema.js";

export const requestPasworReset = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please provide email address", 400));
  }
  const user = await User.findOne({ email }).select("+otp +otpExpires");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const tempid = user._id.toString();
  const otpPrefix = tempid.slice(0, 3).toUpperCase();
  const otpSufix = Math.floor(1000 + crypto.randomInt(0, 9000)).toString();
  const otp = `${otpPrefix}${otpSufix}`;
  const otpExpires = Date.now() + 10 * 60 * 1000;

  await PasswordResetRequest.create({
    userId: user._id,
    otp,
    otpExpires,
  });

  const subject = "Verify Your Email";
  const emailContent = `Your OTP for verification is ${otp}. It will expire in 10 minutes.`;
  sendEmail({
    email,
    subject,
    message: emailContent,
  });

  return res.status(200).json({
    success: true,
    message: "OTP sent to email",
  });
});


