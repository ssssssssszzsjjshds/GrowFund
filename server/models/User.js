import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        // Password is required only if not using OAuth
        return !this.googleId && !this.facebookId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values for unique index
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values for unique index
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    savedCampaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if changed/new
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Helper to compare password for login
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT
userSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const User = mongoose.model("User", userSchema);

export default User;
