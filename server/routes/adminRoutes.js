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

// GET all non-pending campaigns for admin
router.get("/campaigns", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: { $ne: "pending" } }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// GET pending campaigns for review
router.get("/review-campaigns", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: err.message });
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

router.put("/campaigns/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    campaign.status = req.body.status; // "approved" or "rejected"
    await campaign.save();

    res.json({ msg: `Campaign ${campaign.status}` });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update campaign status" });
  }
});

router.get("/campaigns/:id", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    // Only allow admins
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


export default router;
