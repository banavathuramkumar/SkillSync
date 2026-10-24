import express from "express";
import {
  createInstantMeeting,
  scheduleMeeting,
  getTeamMeetings,
  cancelMeeting,
} from "../controllers/meetingController.js";
import { protect, requireProfileComplete } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(requireProfileComplete);

router.post("/instant", createInstantMeeting);
router.post("/schedule", scheduleMeeting);
router.get("/team/:teamId", getTeamMeetings);
router.put("/:id/cancel", cancelMeeting);

export default router;
