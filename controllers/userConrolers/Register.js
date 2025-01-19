import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { User } from "../../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendMail.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      role,
      firstNiche,
      secondNiche,
      thirdNiche,
      coverLetter,
    } = req.body;

    if (!name || !email || !phone || !address || !password || !role) {
      return next(new ErrorHandler("All fields are nequred", 400));
    }
    if (role === "Job seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
      return next(
        new ErrorHandler("please provide your preffered niches", 400)
      );
    }
    if(firstNiche && (firstNiche === secondNiche || firstNiche === thirdNiche || secondNiche == thirdNiche)){
      return next(new ErrorHandler("the niches should be unique",400))
    }

    if(password.length <8){
      return next(new ErrorHandler("Password's length be greater than 8",400))
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email already registered", 400));
    }

    const otp = Math.floor(100000 + crypto.randomInt(0, 900000)).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const userData = {
      name,
      email,
      phone,
      address,
      password,
      role,
      coverLetter,
      niches: {
        firstNiche,
        secondNiche,
        thirdNiche,
      },
      otp,
      otpExpires,
    };

    if (req.files && req.files.resume) {
      const { resume } = req.files;
      if (resume) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            { folder: "Job_seekers_resume" }
          );
          if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(
              new ErrorHandler("Failed to upload resume to cloud", 500)
            );
          }

          userData.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          };
        } catch (error) {
          return next(new ErrorHandler("failed to upload resume", 500));
        }
      }
    }
    const user = await User.create(userData);

    const emailContent = `Your OTP for verification is ${otp}. It will expire in 10 minutes.`;
    const subject = "Verify Your Email";
    sendEmail({
      email: user.email,
      subject,
      message: emailContent,
    });

    res.status(200).json({
      success: true,
      email: user.email,
      message: "Registration successful. Verification email sent.",
    });
  } catch (error) {
    next(error);
  }
});