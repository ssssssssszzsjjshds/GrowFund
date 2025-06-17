import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";

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

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password,
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
    const email = req.body.email.toLowerCase().trim();
    const { password } = req.body;
    console.log("LOGIN EMAIL:", email);
    const user = await User.findOne({ email });
    console.log("USER FOUND:", !!user, user && user.email);
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", match);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    // ...rest of logic

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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send verification email
export const sendVerificationEmail = async (req, res) => {
  const email = req.body.email.toLowerCase().trim();
  const user = await User.findOne({ email }); // use "user" here
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const verifyUrl = `https://yourdomain.com/api/auth/verify-email?token=${token}`;

  // Send email
  await transporter.sendMail({
    to: user.email,
    subject: "Verify your email",
    html: `<p>Click to verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
  });

  res.json({ message: "Verification email sent" });
};

// Handle verification link
export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).send("User not found");

    user.emailVerified = true;
    await user.save();

    // Redirect to frontend with a success message
    res.redirect("https://yourfrontend.com/verified-success");
  } catch (err) {
    res.status(400).send("Invalid or expired token");
  }
};
