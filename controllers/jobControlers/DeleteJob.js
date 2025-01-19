import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { Job } from "../../models/jobSchema.js";
import { Application } from "../../models/applicationSchema.js";

export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Oops! Job not found.", 404));
  }

  if (!job.postedBy.equals(req.user._id)) {
    return next(new ErrorHandler("Only the owner is allowed to delete this job.", 403));
  }

  await Application.updateMany(
    { "jobInfo.jobId": job._id },
    {
      $set: {
        "deletedBy.employer": true,
        status: "rejected",
      },
    }
  );

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job deleted successfully.",
  });
});
