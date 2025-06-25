import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin as verifyAdmin } from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  getAllNonPendingCampaigns,
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign,
  updateCampaignStatus,
  getCampaignById,
  banUser,
  unbanUser,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

// User management
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.put("/users/:id/ban", verifyToken, verifyAdmin, banUser);
router.put("/users/:id/unban", verifyToken, verifyAdmin, unbanUser);
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUser);

// Campaign management
router.get("/campaigns", verifyToken, verifyAdmin, getAllNonPendingCampaigns);
router.get("/review-campaigns", verifyToken, verifyAdmin, getPendingCampaigns);
router.patch(
  "/campaigns/:id/approve",
  verifyToken,
  verifyAdmin,
  approveCampaign
);
router.patch("/campaigns/:id/reject", verifyToken, verifyAdmin, rejectCampaign);
router.put(
  "/campaigns/:id/status",
  verifyToken,
  verifyAdmin,
  updateCampaignStatus
);
router.get("/campaigns/:id", verifyToken, getCampaignById);

// Simple admin dashboard/test route
router.get("/dashboard", verifyToken, verifyAdmin, (req, res) => {
  res.json({ secret: "This is admin stuff." });
});

export default router;
