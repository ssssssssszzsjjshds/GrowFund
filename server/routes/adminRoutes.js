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

export default router;
