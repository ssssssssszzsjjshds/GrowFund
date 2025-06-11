import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Verifies JWT token from HTTP-only cookie named 'token'.
 * Attaches user (without password) to req.user if valid.
 */
export const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};