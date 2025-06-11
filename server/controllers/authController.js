import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        msg: "Email already registered",
        alreadyRegistered: true, // Custom flag for frontend handling
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Respond without setting a cookie or logging in
    res.status(201).json({
      msg: "Registration successful. Please log in.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err); // Log error for debugging
    res.status(500).json({ msg: "Register error", error: err.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT
    const token = user.generateJWT();

    // Set cookie and respond
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    console.error("Login error:", err); // Log error for debugging
    res.status(500).json({ msg: "Login error", error: err.message });
  }
};

// Logout user
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.status(200).json({ msg: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err); // Log error for debugging
    res.status(500).json({ msg: "Logout error", error: err.message });
  }
};

// Get current user info
export const getMe = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Not authenticated" });
    }
    res.status(200).json({ user: req.user });
  } catch (err) {
    console.error("GetMe error:", err); // Log error for debugging
    res.status(500).json({ msg: "GetMe error", error: err.message });
  }
};