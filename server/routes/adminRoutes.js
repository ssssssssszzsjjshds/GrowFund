// routes/adminRoutes.js
import express from "express";
import User from "../models/User.js";
import {Campaign} from "../models/Campaign.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users", err });
  }
});

router.get("/campaigns", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("creator", "name email");
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch campaigns", err });
  }
});

router.get("/review-campaigns", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const pendingCampaigns = await Campaign.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(pendingCampaigns);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch pending campaigns" });
  }
});

// PATCH: Approve campaign
router.patch("/campaigns/:id/approve", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });
    res.json({ msg: "Campaign approved", campaign });
  } catch (err) {
    res.status(500).json({ msg: "Failed to approve campaign" });
  }
});

// PATCH: Reject campaign
router.patch("/campaigns/:id/reject", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });
    res.json({ msg: "Campaign rejected", campaign });
  } catch (err) {
    res.status(500).json({ msg: "Failed to reject campaign" });
  }
});


export default router;
