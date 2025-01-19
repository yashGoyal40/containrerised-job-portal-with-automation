import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { Application } from "../../models/applicationSchema.js";
import { Job } from "../../models/jobSchema.js";

export const employerGetAllApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler("enter the id of the job", 400));
    }
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("job not found", 400));
    }
    const { _id } = req.user;
    const applications = await Application.find({
      "employerInfo.id": _id,
      "deletedBy.employer": false,
      "jobInfo.jobId": job._id,
    });
    res.status(200).json({
      success: true,
      applications,
      message: "list of applications",
    });
  }
);
