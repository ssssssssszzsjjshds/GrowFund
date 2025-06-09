import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createCampaign,
  getAllCampaigns,
  getMyCampaigns,
  getCampaignById,
  deleteCampaign,
  updateCampaign,
} from "../controllers/campaignController.js";

const router = express.Router();

// Multer image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/api/campaigns", verifyToken, upload.single("image"), createCampaign);
router.get("/api/campaigns", getAllCampaigns);
router.get("/api/campaigns/my", verifyToken, getMyCampaigns);
router.get("/api/campaigns/:id", getCampaignById);
router.delete("/api/campaigns/:id", verifyToken, deleteCampaign);
router.patch("/api/campaigns/:id", verifyToken, updateCampaign);

export default router;