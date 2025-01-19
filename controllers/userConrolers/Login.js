import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { User } from "../../models/userSchema.js";
import { sendToken } from "../../utils/jwtToken.js";

export const login = catchAsyncErrors(async (req, res, next) => {
  const { role, email, password } = req.body;
  if (!role || !email || !password) {
    return next(new ErrorHandler("Email, password and role are required", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or password", 400));
  }

  const isPassworMateched = await user.comparePassword(password);
  if (!isPassworMateched) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }
  if (user.role !== role) {
    return next(new ErrorHandler("Invalid user or role", 400));
  }

  sendToken(user, 200, res, "User logged in successfully");
});