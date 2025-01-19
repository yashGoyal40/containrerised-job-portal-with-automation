import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { Job } from "../../models/jobSchema.js";
import { Application } from "../../models/applicationSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, address, coverLetter } = req.body;
  if (!name || !email || !phone || !address || !coverLetter) {
    return next(new ErrorHandler("All feilds are reuired", 400));
  }

  const isAlreadyApplied = await Application.findOne({
    "jobInfo.jobId": id,
    "jobSeekerInfo.id": req.user._id,
  });
  if (isAlreadyApplied) {
    return next(new ErrorHandler("You have already applied for this job", 400));
  }

  const jobSeekerInfo = {
    id: req.user._id,
    name,
    email,
    phone,
    address,
    coverLetter,
    role: "Job seeker",
  };

  const jobDetails = await Job.findById(id);
  if (!jobDetails) {
    return next(new ErrorHandler("job not found", 404));
  }

  if (req.files && req.files.resume) {
    const { resume } = req.files;
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath,
        {
          folder: "Job_seekers_resume",
        }
      );
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Failed to upload resume", 500));
      }
      jobSeekerInfo.resume = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    } catch {
      return next(new ErrorHandler("Failed to upload resume", 500));
    }
  } else {
    if (req.user && !req.user.resume.url) {
      return next(new ErrorHandler("Please upload your resume", 400));
    }

    jobSeekerInfo.resume = {
      public_id: req.user?.resume?.public_id,
      url: req.user?.resume?.url,
    };
  }

  const employerInfo = {
    id: jobDetails.postedBy,
    role: "Employer",
  };

  const jobInfo = {
    jobId: id,
    jobTitle: jobDetails.title,
    companyName: jobDetails.companyName,
  };

  const application = await Application.create({
    jobSeekerInfo,
    employerInfo,
    jobInfo,
  });

  req.user.appliedJobs.push(id);
  await req.user.save();

  jobDetails.applicationCount = jobDetails.applicationCount + 1;
  await jobDetails.save();

  res.status(200).json({
    success: true,
    message: "Application submitted",
    application,
  });
});
