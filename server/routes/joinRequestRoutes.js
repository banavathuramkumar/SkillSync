import express from "express";
import {
  createJoinRequest,
  getTeamRequests,
  getMyRequests,
  respondToJoinRequest,
  withdrawJoinRequest,
} from "../controllers/joinRequestController.js";
import { protect, requireProfileComplete } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, requireProfileComplete, createJoinRequest);
router.get("/my", protect, getMyRequests);
router.get("/team/:teamId", protect, getTeamRequests);
router.put("/:id/decision", protect, respondToJoinRequest);
router.delete("/:id", protect, withdrawJoinRequest);

export default router;
