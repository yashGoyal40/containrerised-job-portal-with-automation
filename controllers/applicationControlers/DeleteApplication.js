import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { Application } from "../../models/applicationSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../../models/userSchema.js";
import { Job } from "../../models/jobSchema.js";

export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const application = await Application.findById(id);

  if (!application) {
    return next(new ErrorHandler("Application not found", 404));
  }

  const { role } = req.user;

  if (role === "Job seeker") {
    application.deletedBy.jobSeeker = true;
  } else if (role === "Employer") {
    application.deletedBy.employer = true;
    if (application.status === "pending") {
      application.status = "rejected";
    }
  } else {
    return next(new ErrorHandler("Unauthorized role for deletion", 403));
  }

  await application.save();

  
  if (application.deletedBy.jobSeeker || (application.deletedBy.employer && application.deletedBy.jobSeeker)) {
    const { public_id } = application.jobSeekerInfo.resume;

    req.user.appliedJobs = req.user.appliedJobs.filter(jobId => jobId.toString() !== application.jobInfo.jobId.toString());
    await req.user.save();

    const job = await Job.findById(application.jobInfo.jobId);
    if (job) {
      job.applicationCount = Math.max(0, job.applicationCount - 1); 
      await job.save();
    }

    await application.deleteOne();

    const isResumeUsed = await Application.exists({
      "jobSeekerInfo.resume.public_id": public_id,
    }) || await User.exists({ "resume.public_id": public_id });

    if (!isResumeUsed && public_id) {
      await cloudinary.uploader.destroy(public_id);
    }
  }

  res.status(200).json({
    success: true,
    message: "Application Deleted.",
  });
});
