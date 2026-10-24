import express from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
  getTeamConversation,
} from "../controllers/messageController.js";
import { protect, requireProfileComplete } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(requireProfileComplete);

router.get("/conversations", getConversations);
router.get("/conversations/team/:teamId", getTeamConversation);
router.get("/conversations/:id/messages", getMessages);
router.post("/conversations/:id/messages", sendMessage);

export default router;
