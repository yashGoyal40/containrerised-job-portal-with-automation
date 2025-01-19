import express from "express";
import {
  deleteUser,
  passwordReset,
  requestPasworReset,
  getUser,
  login,
  logout,
  register,
  updatePasswrod,
  updateProfile,
  verifyUser,
} from "../controllers/userConrolers/index.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyUser);
router.post("/login", login);
router.post("/forgotpass/requst",requestPasworReset);
router.post("/forgotpass/changepass",passwordReset)
router.get("/logout", isAuthenticated, logout);
router.get("/getUser", isAuthenticated, getUser);
router.put("/update/profile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePasswrod);
router.delete("/delete", isAuthenticated, deleteUser);
export default router;
