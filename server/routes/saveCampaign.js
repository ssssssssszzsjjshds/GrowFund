import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  saveCampaign,
  getSavedCampaigns,
  unsaveCampaign,
} from "../controllers/saveCampaignController.js";

const router = express.Router();

// POST /api/save-campaign - save a campaign
router.post("/", verifyToken, saveCampaign);

// GET /api/save-campaign - get saved campaigns for user
router.get("/", verifyToken, getSavedCampaigns);

// DELETE /api/save-campaign/:campaignId - unsave a campaign
router.delete("/:campaignId", verifyToken, unsaveCampaign);

export default router;
