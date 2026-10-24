import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/", apiLimiter, submitFeedback);

export default router;
