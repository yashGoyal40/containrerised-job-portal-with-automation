import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import { Job } from "../../models/jobSchema.js";

export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    message:"jobs leaded successfully",
    myJobs,
    count: myJobs.length,
  });
});
