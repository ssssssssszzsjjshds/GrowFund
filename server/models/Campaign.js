import mongoose from "mongoose";
import { categories } from "../../shared/categories.js"; // adjust path if needed

const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["text", "image"],
      required: true,
    },
    content: {
      type: String,
      required: true, // For text: the text itself; For image: the image URL
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);
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
    views: { type: Number, default: 0, select: false },
    lastViewedAt: {
      type: Date,
      select: false,
    },
    viewHistory: [{ timestamp: Date }],
    blocks: {
      type: [blockSchema],
      default: [],
    },
  },

  { timestamps: true }
);

export const Campaign = mongoose.model("Campaign", campaignSchema);
