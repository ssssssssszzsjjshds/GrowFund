import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/authMiddleware.js";
import { searchUsersByName } from "../controllers/userController.js";

router.get("/search", verifyToken, searchUsersByName);

export default router;
