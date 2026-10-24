import express from "express";
import {
  getPlatformStats,
  getActivityStats,
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/", getPlatformStats);
router.get("/activity", getActivityStats);

export default router;
