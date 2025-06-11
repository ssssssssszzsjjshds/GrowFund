import express from "express";
import { getBalance, addBalance } from "../controllers/balanceController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getBalance);
router.post("/add", verifyToken, addBalance);

export default router;
