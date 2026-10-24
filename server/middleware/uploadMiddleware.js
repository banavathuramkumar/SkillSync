import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env.js";

const resumeDir = path.join(env.UPLOAD_DIR, "resumes");
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedUserId = req.user ? req.user._id.toString() : "anon";
    const uniqueName = `resume-${sanitizedUserId}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMime = "application/pdf";
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.mimetype === allowedMime && ext === ".pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are supported for resumes."), false);
  }
};

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: env.MAX_UPLOAD_SIZE, // 5MB
  },
  fileFilter,
});

// Avatar Storage Configuration
const avatarDir = path.join(env.UPLOAD_DIR, "avatars");
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedUserId = req.user ? req.user._id.toString() : "user";
    const uniqueName = `avatar-${sanitizedUserId}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const avatarFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and WebP images are supported."), false);
  }
};

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB cap
  },
  fileFilter: avatarFilter,
});
