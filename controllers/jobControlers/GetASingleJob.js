import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { Job } from "../../models/jobSchema.js";

export const getASingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler("Oops! job not found", 404));
  }
  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Oops! job not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "job found",
      job,
    });
  } catch (error) {
      return next(new ErrorHandler("Oops! job not found", 404));
  }
});
