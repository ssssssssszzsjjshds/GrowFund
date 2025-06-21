import express from "express";
import { getUserActivity } from "../controllers/userActivityController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // <-- Add your auth middleware

const router = express.Router();

router.get("/activity", verifyToken, getUserActivity); // <-- Add middleware

export default router;
