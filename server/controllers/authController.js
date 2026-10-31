import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email, and password.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "An account with this email address already exists.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      isProfileComplete: false,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        educationLevel: user.educationLevel,
        state: user.state,
        city: user.city,
        skills: user.skills,
        bio: user.bio,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        leetcodeUrl: user.leetcodeUrl,
        avatar: user.avatar,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log in existing user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        educationLevel: user.educationLevel,
        state: user.state,
        city: user.city,
        skills: user.skills,
        bio: user.bio,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        leetcodeUrl: user.leetcodeUrl,
        resumeUrl: user.resumeUrl,
        resumeFilename: user.resumeFilename,
        avatar: user.avatar,
        isProfileComplete: user.isProfileComplete,
        savedTeams: user.savedTeams,
        savedCompetitions: user.savedCompetitions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Sign in / register seamlessly with Google
 * POST /api/auth/google
 */
export const googleAuth = async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Google email address is required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const isOwner = cleanEmail === "banavathuramkumar@gmail.com";
      const randomPassword = `G_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;

      user = await User.create({
        name: name?.trim() || (isOwner ? "Ramkumar Banavathu" : cleanEmail.split("@")[0]),
        email: cleanEmail,
        password: randomPassword,
        avatar: avatar || "",
        isProfileComplete: isOwner,
        college: isOwner ? "SRM University AP" : "",
        educationLevel: isOwner ? "B.Tech Computer Science and Engineering" : "",
        state: isOwner ? "Andhra Pradesh" : "",
        city: isOwner ? "Amaravati" : "",
        skills: isOwner ? ["React", "Node.js", "JavaScript", "Tailwind CSS", "MongoDB", "Full Stack Systems"] : [],
        bio: isOwner ? "Developer & Founder of SkillSync. Team Member & Owner of Corporate Connect." : "",
        githubUrl: isOwner ? "https://github.com/banavathuramkumar" : "",
        linkedinUrl: isOwner ? "https://www.linkedin.com/in/banavathu-ramkumar/" : "",
        leetcodeUrl: isOwner ? "https://leetcode.com/banavathuramkumar" : "",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        educationLevel: user.educationLevel,
        state: user.state,
        city: user.city,
        skills: user.skills,
        bio: user.bio,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        leetcodeUrl: user.leetcodeUrl,
        avatar: user.avatar,
        isProfileComplete: user.isProfileComplete,
        savedTeams: user.savedTeams,
        savedCompetitions: user.savedCompetitions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      educationLevel: user.educationLevel,
      state: user.state,
      city: user.city,
      skills: user.skills,
      bio: user.bio,
      githubUrl: user.githubUrl,
      linkedinUrl: user.linkedinUrl,
      leetcodeUrl: user.leetcodeUrl,
      resumeUrl: user.resumeUrl,
      resumeFilename: user.resumeFilename,
      avatar: user.avatar,
      isProfileComplete: user.isProfileComplete,
      savedTeams: user.savedTeams,
      savedCompetitions: user.savedCompetitions,
    },
  });
};

/**
 * Complete mandatory profile
 * POST /api/auth/complete-profile
 */
export const completeProfile = async (req, res, next) => {
  try {
    const {
      name,
      college,
      educationLevel,
      state,
      city,
      skills,
      bio,
      githubUrl,
      linkedinUrl,
      leetcodeUrl,
      resumeName,
      avatar,
    } = req.body;

    // Validate mandatory profile fields
    if (!name || !college || !educationLevel || !state || !city || !bio) {
      return res.status(400).json({
        success: false,
        error: "All profile fields are mandatory to complete registration.",
      });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please select or add at least one skill.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name.trim(),
        college: college.trim(),
        educationLevel,
        state,
        city: city.trim(),
        skills,
        bio: bio.trim(),
        githubUrl: githubUrl ? githubUrl.trim() : "",
        linkedinUrl: linkedinUrl ? linkedinUrl.trim() : "",
        leetcodeUrl: leetcodeUrl ? leetcodeUrl.trim() : "",
        resumeFilename: resumeName || req.user.resumeFilename || "",
        avatar: avatar !== undefined ? avatar : (req.user.avatar || ""),
        isProfileComplete: true, // Gate unlocked!
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Profile completed successfully! Welcome to SkillSync.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        college: updatedUser.college,
        educationLevel: updatedUser.educationLevel,
        state: updatedUser.state,
        city: updatedUser.city,
        skills: updatedUser.skills,
        bio: updatedUser.bio,
        githubUrl: updatedUser.githubUrl,
        linkedinUrl: updatedUser.linkedinUrl,
        leetcodeUrl: updatedUser.leetcodeUrl,
        resumeUrl: updatedUser.resumeUrl,
        resumeFilename: updatedUser.resumeFilename,
        avatar: updatedUser.avatar,
        isProfileComplete: updatedUser.isProfileComplete,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    const allowed = [
      "name",
      "college",
      "educationLevel",
      "state",
      "city",
      "skills",
      "bio",
      "githubUrl",
      "linkedinUrl",
      "leetcodeUrl",
      "avatar",
      "resumeFilename",
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const updated = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        college: updated.college,
        educationLevel: updated.educationLevel,
        state: updated.state,
        city: updated.city,
        skills: updated.skills,
        bio: updated.bio,
        githubUrl: updated.githubUrl,
        linkedinUrl: updated.linkedinUrl,
        leetcodeUrl: updated.leetcodeUrl,
        resumeUrl: updated.resumeUrl,
        resumeFilename: updated.resumeFilename,
        avatar: updated.avatar,
        isProfileComplete: updated.isProfileComplete,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload Resume (PDF only, max 5MB)
 * POST /api/auth/resume
 */
export const uploadResumeFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a valid PDF file (maximum 5 MB).",
      });
    }

    const resumeUrl = `/api/auth/resume/${req.file.filename}`;
    const originalName = req.file.originalname;

    // Read file buffer and store permanently in MongoDB to survive container restarts/ephemeral disks
    let resumeBase64 = "";
    if (req.file.buffer) {
      resumeBase64 = req.file.buffer.toString("base64");
    } else if (req.file.path && fs.existsSync(req.file.path)) {
      const fileBuffer = fs.readFileSync(req.file.path);
      resumeBase64 = fileBuffer.toString("base64");
    }

    if (!resumeBase64) {
      return res.status(500).json({
        success: false,
        error: "Could not read uploaded PDF resume file.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        resumeUrl,
        resumeFilename: originalName,
        resumeData: resumeBase64,
        resumeContentType: req.file.mimetype || "application/pdf",
      },
      { new: true }
    );

    res.json({
      success: true,
      resumeUrl,
      resumeFilename: originalName,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        college: updatedUser.college,
        educationLevel: updatedUser.educationLevel,
        state: updatedUser.state,
        city: updatedUser.city,
        skills: updatedUser.skills,
        bio: updatedUser.bio,
        githubUrl: updatedUser.githubUrl,
        linkedinUrl: updatedUser.linkedinUrl,
        leetcodeUrl: updatedUser.leetcodeUrl,
        resumeUrl: updatedUser.resumeUrl,
        resumeFilename: updatedUser.resumeFilename,
        avatar: updatedUser.avatar,
        isProfileComplete: updatedUser.isProfileComplete,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Upload Profile Picture (JPG/PNG/WebP, max 3MB)
 * POST /api/auth/avatar
 */
export const uploadAvatarFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please select an image file (JPG, PNG, WebP) up to 3MB.",
      });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({
      success: true,
      avatarUrl,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove Profile Picture (revert to No Profile Pic)
 * DELETE /api/auth/avatar
 */
export const removeAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: "" },
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile picture removed successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Serve/Stream protected resume file
 * GET /api/auth/resume/:filename
 */
export const serveResume = async (req, res) => {
  const { filename } = req.params;
  const safeFilename = path.basename(filename);
  const filePath = path.join(env.UPLOAD_DIR, "resumes", safeFilename);

  // Set anti-caching headers so updated resumes open immediately and don't leak stale browser caches
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // 1. Try disk if present
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${safeFilename}"`);
    const stream = fs.createReadStream(filePath);
    return stream.pipe(res);
  }

  // 2. Lookup in MongoDB Atlas database (preserves files across server redeploys and ephemeral disks)
  try {
    let user = await User.findOne({
      $or: [
        { resumeUrl: `/api/auth/resume/${safeFilename}` },
        { resumeUrl: safeFilename },
      ],
    });

    // If not found by exact URL (e.g. user updated their resume and filename timestamp changed),
    // extract userId from filename format: "resume-<userId>-<timestamp>.pdf"
    if (!user) {
      const match = safeFilename.match(/^resume-([a-f0-9]{24})-/i);
      if (match && match[1]) {
        user = await User.findById(match[1]);
      }
    }

    if (user && user.resumeData) {
      const buffer = Buffer.from(user.resumeData, "base64");
      res.setHeader("Content-Type", user.resumeContentType || "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${user.resumeFilename || safeFilename}"`
      );
      return res.end(buffer);
    }
  } catch (dbErr) {
    console.error("[Serve Resume] DB Fallback error:", dbErr.message);
  }

  return res.status(404).json({
    success: false,
    error: "Resume file not found.",
  });
};

/**
 * Forgot password request
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      error: "Please provide an email address.",
    });
  }

  // Generic message for security (don't reveal if user exists)
  res.json({
    success: true,
    message: "If an account exists with this email, password reset instructions have been dispatched.",
  });
};
