import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User is not Authenicated", 400));
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
  req.user = await User.findById(decoded.id);
  
  if (!req.user) {
    return next(new ErrorHandler("user not found", 400));
  }
  
  if (!req.user.isVerified) {
    return next(
      new ErrorHandler("user is Authenticated but not verified", 400)
    );
  }
    
  next();
});

export const isAutherised = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} not allowed to access this resource`)
      );
    }
    next();
  };
};
