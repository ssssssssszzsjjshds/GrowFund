import express from "express";
import Comment from "../models/Comment.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/comments/:campaignId
router.get("/:campaignId", async (req, res) => {
  try {
    const comments = await Comment.find({
      campaignId: req.params.campaignId,
    }).populate("userId", "name");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load comments", err });
  }
});

// POST /api/comments
router.post("/", verifyToken, async (req, res) => {
  try {
    const { campaignId, content } = req.body;
    if (!content) return res.status(400).json({ msg: "Content is required" });

    const newComment = await Comment.create({
      userId: req.user.id,
      campaignId,
      content,
    });

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ msg: "Failed to post comment", err });
  }
});

// DELETE /api/comments/:id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.userId.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized" });

    await comment.deleteOne();
    res.json({ msg: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete comment", err });
  }
});

export default router;
