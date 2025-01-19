import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { User } from "../../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    role: req.body.role,
    coverLetter: req.body.coverLetter,
    niches: {
      firstNiche: req.body.firstNiche,
      secondNiche: req.body.secondNiche,
      thirdNiche: req.body.thirdNiche,
    },
  };
  const { firstNiche, secondNiche, thirdNiche } = newUserData.niches;

  if (
    req.user.role === "Job seeker" &&
    (firstNiche || secondNiche || thirdNiche) &&
    (!firstNiche || !secondNiche || !thirdNiche)
  ) {
    return next(
      new ErrorHandler("please provide your all preffered niches", 400)
    );
  }

  if(firstNiche && (firstNiche === secondNiche || firstNiche === thirdNiche || secondNiche == thirdNiche)){
    return next(new ErrorHandler("the niches should be unique",400))
  }
  
  if (req.files) {
    const { resume } = req.files;

    if (resume) {
      const currentResumeId = req.user.resume.public_id;
      if (currentResumeId) {
        await cloudinary.uploader.destroy(currentResumeId);
      }

      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "Job_seekers_resume",
      });
      newUserData.resume = {
        public_id: newResume.public_id,
        url: newResume.secure_url,
      };
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
    message: "Profile updated successfully",
  });
});
