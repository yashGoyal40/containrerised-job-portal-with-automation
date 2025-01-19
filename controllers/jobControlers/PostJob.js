import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { Job } from "../../models/jobSchema.js";

export const postjob = catchAsyncErrors(async (req, res, next) => {
  if (!req.body) {
    return next(new ErrorHandler("please provide full job details", 400));
  }
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsiteUrl,
    personalWebsiteTitle,
    jobNiche,
    newsLettersSent,
  } = req.body;

  if (
    !title ||
    !jobType ||
    !location ||
    !companyName ||
    !responsibilities ||
    !qualifications ||
    !salary ||
    !jobNiche
  ) {
    return next(new ErrorHandler("Please provide full job details", 400));
  }

  if (
    (personalWebsiteTitle && !personalWebsiteUrl) ||
    (personalWebsiteUrl && !personalWebsiteTitle)
  ) {
    return next(
      new ErrorHandler(
        "either Provide both website url and title or leave both blank",
        400
      )
    );
  }

  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsite: {
      url: personalWebsiteUrl,
      title: personalWebsiteTitle,
    },
    jobNiche,
    newsLettersSent,
    postedBy,
  });

  res.status(200).json({
    success: true,
    message: "Job Posted Successfully",
    job,
  });
});