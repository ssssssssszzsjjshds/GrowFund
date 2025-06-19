import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  sendVerificationEmail,
  verifyEmail,
  changePassword,
  resetPassword,
  forgotPassword,
  serveResetPasswordPage,
  updateMe,
} from "../controllers/authController.js";
import passport from "passport";
import { verifyToken } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

// Local Authentication
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Get Authenticated User
router.get("/me", verifyToken, getMe);
router.patch("/me", verifyToken, updateMe);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
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
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful login, generate JWT or set session
    const token = req.user.generateJWT(); // Assume `generateJWT` method in User model
    res.cookie("token", token, { httpOnly: true });
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

// Email verification
router.post("/send-verification", sendVerificationEmail);
router.get("/verify-email", verifyEmail);

router.get("/verified-success", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Verified</title>
      <style>
        body { display: flex; align-items: center; justify-content: center; height: 100vh; background: #f7f7f7; }
        .box {
          background: #fff;
          padding: 2rem 3rem;
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          text-align: center;
        }
        .success { color: #28a745; font-size: 2rem; margin-bottom: 1rem; }
        .redirect { color: #888; margin-top: 1rem; }
        button {
          margin-top: 1.5rem;
          padding: 0.5rem 1.2rem;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
        }
        button:hover { background: #0056b3; }
      </style>
      <script>
        setTimeout(function() {
          window.location = "http://localhost:5173/settings/profile";
        }, 5000);
      </script>
    </head>
    <body>
      <div class="box">
        <div class="success">&#10003; Email verification successful!</div>
        <div class="redirect">Redirecting to your profile in 5 seconds...</div>
        <button onclick="window.location='http://localhost:5173/settings/profile'">Go to Profile Now</button>
      </div>
    </body>
    </html>
  `);
});
router.post("/change-password", verifyToken, changePassword);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", serveResetPasswordPage);
router.post("/reset-password/:token", resetPassword);
export default router;
