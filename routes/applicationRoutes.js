import express from "express";
import { isAuthenticated, isAutherised } from "../middlewares/auth.js";
import {
  deleteApplication,
  employerGetAllApplication,
  jobSeekerGetAllApplication,
  postApplication,
  ApplicationApproved,
  EmployeeGetSingleApplication,
} from "../controllers/applicationControlers/index.js";

const router = express.Router();

router.post(
  "/apply/:id",
  isAuthenticated,
  isAutherised("Job seeker"),
  postApplication
);

router.get(
  "/employer/getall/:id",
  isAuthenticated,
  isAutherised("Employer"),
  employerGetAllApplication
);

router.get(
  "/jobseeker/getall",
  isAuthenticated,
  isAutherised("Job seeker"),
  jobSeekerGetAllApplication
);

router.put(
  "/approve/:id",
  isAuthenticated,
  isAutherised("Employer"),
  ApplicationApproved
);

router.get(
  "/jobseeker/get/application/:id",
  isAuthenticated,
  isAutherised("Job seeker"),
  EmployeeGetSingleApplication
)

router.delete("/delete/:id", isAuthenticated, deleteApplication);

export default router;
