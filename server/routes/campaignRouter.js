import express from "express";
import multer from "multer";
import { Campaign } from "../models/Campaign.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import fs from "fs";
import path from "path"; // Optional auth middleware

const router = express.Router();

// Set up Multer (store images in "uploads/" folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// @route   POST /api/campaigns
// @desc    Create new campaign
router.post(
  "/api/campaigns",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, goal, deadline } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      const campaign = new Campaign({
        title,
        description,
        goal,
        deadline,
        image,
        creator: req.user.id, // 🔥 This links the campaign to the logged-in user
      });

      await campaign.save();
      res.status(201).json(campaign);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

// @route   GET /api/campaigns
// @desc    Get all campaigns
router.get("/api/campaigns", async (req, res) => {
  try {
    const filter = {};
    const { search, userId } = req.query;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (userId) {
      filter.creator = userId;
    }

    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/api/campaigns/my", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const campaigns = await Campaign.find({ creator: userId }).sort({
      createdAt: -1,
    });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch your campaigns" });
  }
});

router.get("/api/campaigns/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/api/campaigns/:id", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    // Allow deletion by the creator OR an admin
    const isOwner = campaign.creator.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to delete this campaign" });
    }

    // Delete associated image file (if it exists)
    if (campaign.image) {
      const imagePath = path.join("public", campaign.image); // adjust if needed
      fs.unlink(imagePath, (err) => {
        if (err) console.warn("Image not deleted:", err.message);
      });
    }

    await campaign.deleteOne();
    res.json({ msg: "Campaign deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
router.patch("/api/campaigns/:id", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    // Authorization check
    if (campaign.creator.toString() !== req.user.id)
      return res
        .status(403)
        .json({ msg: "Not authorized to update this campaign" });

    Object.assign(campaign, req.body);
    await campaign.save();

    res.json({ msg: "Campaign updated", campaign });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
