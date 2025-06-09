import express from "express";
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
router.post("/api/auth/logout", logout);

export default router;