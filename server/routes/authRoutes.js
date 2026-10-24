import express from "express";
import {
  register,
  login,
  googleAuth,
  getMe,
  completeProfile,
  updateProfile,
  uploadResumeFile,
  uploadAvatarFile,
  removeAvatar,
  serveResume,
  forgotPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadResume, uploadAvatar } from "../middleware/uploadMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);

router.get("/me", protect, getMe);
router.post("/complete-profile", protect, completeProfile);
router.put("/profile", protect, updateProfile);
router.post("/resume", protect, uploadResume.single("resume"), uploadResumeFile);
router.get("/resume/:filename", serveResume);
router.post("/avatar", protect, uploadAvatar.single("avatar"), uploadAvatarFile);
router.delete("/avatar", protect, removeAvatar);

export default router;
