import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

/**
 * Protect routes - Verifies JWT Bearer token
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authentication required. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found or session has expired.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired authorization token.",
    });
  }
};

/**
 * Mandatory profile completion check
 */
export const requireProfileComplete = (req, res, next) => {
  if (!req.user || !req.user.isProfileComplete) {
    return res.status(403).json({
      success: false,
      error: "Profile setup incomplete. Please complete your profile first.",
      profileIncomplete: true,
    });
  }
  next();
};
