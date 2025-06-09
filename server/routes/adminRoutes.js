import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  getAllNonPendingCampaigns,
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign,
  updateCampaignStatus,
  getCampaignById
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.get("/campaigns", verifyToken, verifyAdmin, getAllNonPendingCampaigns);
router.get("/review-campaigns", verifyToken, verifyAdmin, getPendingCampaigns);
router.patch("/campaigns/:id/approve", verifyToken, verifyAdmin, approveCampaign);
router.patch("/campaigns/:id/reject", verifyToken, verifyAdmin, rejectCampaign);
router.put("/campaigns/:id/status", verifyToken, verifyAdmin, updateCampaignStatus);
router.get("/campaigns/:id", verifyToken, getCampaignById);

export default router;