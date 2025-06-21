import express from "express";
import multer from "multer";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/profile/" }); // or configure storage as needed

router.post(
  "/profile-picture",
  verifyToken,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      user.profilePic = `/uploads/profile/${req.file.filename}`;
      await user.save();
      res.json({ profilePic: user.profilePic });
    } catch (err) {
      res.status(500).json({ msg: "Failed to upload profile pic" });
    }
  }
);

export default router;
