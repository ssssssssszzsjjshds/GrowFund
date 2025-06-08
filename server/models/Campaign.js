import mongoose from "mongoose";
import { categories } from "../../shared/categories.js"; // adjust path if needed

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    goal: { type: Number, required: true },
    image: { type: String },
    deadline: { type: Date, required: true },
    category: {
      type: String,
      enum: categories,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    raisedAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

export const Campaign = mongoose.model("Campaign", campaignSchema);
