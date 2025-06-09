import express from "express";
import { register, login, logout, getMe } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
router.post("/api/auth/logout", logout);
router.get("/me", verifyToken, getMe);
export default router;