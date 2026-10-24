import express from "express";
import {
  getCompetitions,
  getCompetitionById,
  toggleSaveCompetition,
} from "../controllers/competitionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCompetitions);
router.get("/:id", getCompetitionById);
router.post("/:id/save", protect, toggleSaveCompetition);

export default router;
