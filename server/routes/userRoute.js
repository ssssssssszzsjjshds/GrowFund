
import express from "express";
const router = express.Router();
import { getPublicProfile } from "../controllers/userController.js";

// routes/user.js
router.get("/:id", getPublicProfile); // public, no auth middleware

export default router;