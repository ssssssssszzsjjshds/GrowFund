import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getConversation,
  getConversationsList,
} from "../controllers/messageController.js";

const router = express.Router();
// All routes require authentication
router.get("/conversations", verifyToken, getConversationsList); // <-- static first!
router.get("/:userId", verifyToken, getConversation);            // <-- dynamic after
router.post("/", verifyToken, sendMessage);


export default router;
