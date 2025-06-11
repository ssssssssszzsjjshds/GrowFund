import express from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";
import passport from "passport";
import { verifyToken } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

// Local Authentication
router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
router.post("/api/auth/logout", logout);

// Get Authenticated User
router.get("/api/auth/me", verifyToken, getMe);

// Google OAuth Routes
router.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const token = req.user.generateJWT(); // Assuming generateJWT is defined in the User model
      res.cookie("token", token, { httpOnly: true });
       res.redirect(`${process.env.FRONTEND_URL}/`); // Redirect to homepage after successful login
    } catch (error) {
      console.error("Error handling Google callback:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Facebook OAuth Routes
router.get(
  "/api/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/api/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful login, generate JWT or set session
    const token = req.user.generateJWT(); // Assume `generateJWT` method in User model
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  }
);

export default router;