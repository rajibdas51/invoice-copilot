import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
} from "../controllers/authController.js";

import protect from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.route("/me").get(protect, getMe).put(protect, updateUserProfile);
authRouter.post("/forgot-password", forgotPassword);
authRouter.put("/reset-password/:token", resetPassword);
authRouter.get("/google", googleAuth);
authRouter.get("/google/callback", googleCallback);

export default authRouter;
