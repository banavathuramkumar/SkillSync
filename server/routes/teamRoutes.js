import express from "express";
import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  toggleRecruitment,
  toggleSaveTeam,
  getSavedTeams,
  getMyTeams,
  addComment,
  leaveTeam,
  removeMember,
} from "../controllers/teamController.js";
import { protect, requireProfileComplete } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getTeams);
router.get("/saved", protect, getSavedTeams);
router.get("/my", protect, getMyTeams);
router.get("/:id", getTeamById);

router.post("/", protect, requireProfileComplete, createTeam);
router.put("/:id", protect, requireProfileComplete, updateTeam);
router.delete("/:id", protect, deleteTeam);
router.post("/:id/toggle-recruitment", protect, toggleRecruitment);
router.post("/:id/save", protect, toggleSaveTeam);
router.post("/:id/comments", protect, requireProfileComplete, addComment);
router.post("/:id/leave", protect, leaveTeam);
router.delete("/:id/members/:userId", protect, removeMember);

export default router;
