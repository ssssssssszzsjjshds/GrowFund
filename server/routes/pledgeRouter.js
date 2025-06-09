import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createPledge } from "../controllers/pledgeController.js";

const router = express.Router();

// POST /api/pledges
router.post("/", verifyToken, createPledge);

export default router;