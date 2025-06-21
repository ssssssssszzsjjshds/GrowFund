import express from "express";
import { getUserActivity } from "../controllers/userActivityController.js";

// Assumes you have authentication middleware (e.g. requireAuth) that sets req.user
const router = express.Router();

router.get("/activity", getUserActivity);

export default router;
