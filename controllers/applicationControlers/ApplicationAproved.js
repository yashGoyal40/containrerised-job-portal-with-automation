import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { Application } from "../../models/applicationSchema.js";
import { sendEmail } from "../../utils/sendMail.js";
import { approvalMessage } from "../../utils/congratulationsMail.js";

export const ApplicationApproved = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("please provide Id", 400));
  }

  try {
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("application not found", 404));
    }

    const userid = req.user._id;

    const reqId = application.employerInfo.id;

    if (!userid.equals(reqId)) {
      return next(
        new ErrorHandler(
          "Only the owner of this job can approve the application.",
          400
        )
      );
    }

    if (application.status === "approved") {
      return next(
        new ErrorHandler("This application is already approved.", 400)
      );
    }

    application.status = "approved";

    await application.save();

    const message = approvalMessage(
      application.jobSeekerInfo.name,
      application.jobInfo.jobTitle,
      application.jobInfo.companyName
    );

    sendEmail({
      email: application.jobSeekerInfo.email,
      subject: "Congratulations, you have been placed.",
      message,
    });

    res.status(200).json({
      success: true,
      message: "application is approved",
    });
  } catch {
    return next(new ErrorHandler("application not found", 404));
  }
});
