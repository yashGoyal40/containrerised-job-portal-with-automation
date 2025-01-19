import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import { User } from "../../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { Job } from "../../models/jobSchema.js";
import { Application } from "../../models/applicationSchema.js";

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;

  if (user.resume) {
    const resumeID = user.resume.public_id;
    if (resumeID) {
      await cloudinary.uploader.destroy(resumeID);
    }
  }
  if (user.role === "Employer") {
    await Job.deleteMany({ postedBy: user._id });
    await Application.deleteMany({ "employerInfo.id": user._id });
  }
  if (user.role === "Job seeker") {
    await Application.deleteMany({ "jobSeekerInfo.id": user._id });
  }

  await User.findByIdAndDelete(user._id);

  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    })
    .json({
      success: true,
      message: "User Deleted succesfully with all the applications/jobs",
    });
});
