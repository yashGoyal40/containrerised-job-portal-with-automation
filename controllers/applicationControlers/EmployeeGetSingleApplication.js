import { catchAsyncErrors } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/error.js";
import { Application } from "../../models/applicationSchema.js";

export const EmployeeGetSingleApplication = catchAsyncErrors(async (req, res, next) => {

  const { id } = req.params;
  if(!id){
    return next(new ErrorHandler("please provide Id", 400));
  }
  try{
    const application = await Application.findById(id);


    if(!application){
    return next(new ErrorHandler("application not found",400))
    }

    const userid = req.user._id;
    const reqId = application.jobSeekerInfo.id;

    if (!userid.equals(reqId)) {
      return next(
        new ErrorHandler(
          "Only applicant who applied can see application details",
          400
        )
      );
    }

    res.status(200).json({
      success: true,
      application,
      message: "application loaded succesfully",
    });



  }catch{
    return next(new ErrorHandler("application not found",400))
  }


});
