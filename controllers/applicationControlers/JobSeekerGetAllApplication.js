import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import { Application } from "../../models/applicationSchema.js";

export const jobSeekerGetAllApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { _id } = req.user;
    const applications = await Application.find({
      "jobSeekerInfo.id": _id,
      "deletedBy.jobSeeker": false,
    });
    res.status(200).json({
      success: true,
      applications,
      message: "list of applications",
    });
  }
);


