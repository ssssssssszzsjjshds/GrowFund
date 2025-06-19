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
    user: process.env.GMAIL_USER, // set this in your .env file
    pass: process.env.GMAIL_PASS, // set this in your .env file (App Password)
  },
  tls: {
    rejectUnauthorized: false, // <-- add this line
  },
});
// Send verification email
export const sendVerificationEmail = async (req, res) => {
  // Defensive: log and check body
  if (!req.body || !req.body.email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Defensive: handle possible undefined
  const email = req.body.email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const verifyUrl = `http://localhost:5000/api/auth/verify-email?token=${token}`;

    // Send email
    await transporter.sendMail({
      to: user.email,
      subject: "Verify your email",
      html: `<p>Click to verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });

    res.json({ message: "Verification email sent" });
  } catch (err) {
    console.error("Error in sendVerificationEmail:", err);
    res.status(500).json({
      message: "Failed to send verification email",
      error: err.message,
    });
  }
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
    res.redirect("http://localhost:5000/api/auth/verified-success");
  } catch (err) {
    res.status(400).send("Invalid or expired token");
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // depending on your JWT middleware
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const match = await user.comparePassword(currentPassword);
    if (!match)
      return res.status(400).json({ msg: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(200)
      .json({ msg: "If that email exists, a reset link has been sent." }); // Prevent user enumeration

  // Create token with short expiry
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

  // Optionally, store token on user: user.resetPasswordToken = token; user.save();

  // Email link
  const resetUrl = `http://localhost:5173/reset-password/${token}`;
  await transporter.sendMail({
    to: user.email,
    subject: "Password Reset",
    html: `<p>Click to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  res
    .status(200)
    .json({ msg: "If that email exists, a reset link has been sent." });
};

// 2. Reset Password Handler
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Passwords do not match" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.password = password; // Make sure hashing happens in your User model
    await user.save();
    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};

// Password reset HTML page (with Tailwind)
export const serveResetPasswordPage = (req, res) => {
  const { token } = req.params;
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Reset Password</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form id="resetForm" class="space-y-4">
          <input type="hidden" name="token" value="${token}" />
          <div>
            <label class="block text-sm mb-1">New Password</label>
            <input type="password" name="password" class="w-full border p-2 rounded" required />
          </div>
          <div>
            <label class="block text-sm mb-1">Confirm Password</label>
            <input type="password" name="confirmPassword" class="w-full border p-2 rounded" required />
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Update Password
          </button>
        </form>
        <div id="msg" class="mt-4 text-center text-sm"></div>
      </div>
      <script>
        const form = document.getElementById('resetForm');
        const msgDiv = document.getElementById('msg');
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          msgDiv.textContent = 'Updating...';

          const password = form.password.value;
          const confirmPassword = form.confirmPassword.value;
          const token = form.token.value;

          try {
            const res = await fetch('/api/auth/reset-password/' + token, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password, confirmPassword }),
            });
            const data = await res.json();
            if (res.ok) {
              msgDiv.textContent = 'Password reset successful! You can now log in.';
              msgDiv.className = 'mt-4 text-center text-green-600 text-sm';
              form.reset();
            } else {
              msgDiv.textContent = data.msg || 'Failed to reset password.';
              msgDiv.className = 'mt-4 text-center text-red-600 text-sm';
            }
          } catch {
            msgDiv.textContent = 'Error: Could not connect to server.';
            msgDiv.className = 'mt-4 text-center text-red-600 text-sm';
          }
        });
      </script>
    </body>
    </html>
  `);
};

export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id; // populated by your auth middleware
    const { instagram, facebook, linkedin, portfolio } = req.body;

    // Only update fields that were actually sent in the request
    const updateData = {};
    if (instagram !== undefined) updateData.instagram = instagram;
    if (facebook !== undefined) updateData.facebook = facebook;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (portfolio !== undefined) updateData.portfolio = portfolio;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ msg: "No valid fields provided for update." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password"); // don't return password

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found." });
    }

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ msg: "Server error.", error: err.message });
  }
};