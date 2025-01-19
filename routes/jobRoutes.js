import express from "express";
import { isAuthenticated, isAutherised } from "../middlewares/auth.js";
import {
  postjob,
  getAllJobs,
  getMyJobs,
  deleteJob,
  getASingleJob,
} from "../controllers/jobControlers/index.js";

const router = express.Router();

router.post("/post", isAuthenticated, isAutherised("Employer"), postjob);
router.get("/getall", getAllJobs);
router.get("/getmyjobs", isAuthenticated, isAutherised("Employer"), getMyJobs);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAutherised("Employer"),
  deleteJob
);
router.get("/get/:id", isAuthenticated, getASingleJob);
export default router;
