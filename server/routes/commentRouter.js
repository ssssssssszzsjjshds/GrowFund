import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// GET /api/comments/:campaignId
router.get("/:campaignId", getComments);

// POST /api/comments
router.post("/", verifyToken, createComment);

// DELETE /api/comments/:id
router.delete("/:id", verifyToken, deleteComment);

export default router;