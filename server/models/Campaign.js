import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    goal: { type: Number, required: true },
    image: { type: String },
    deadline: { type: Date, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    raisedAmount: { type: Number, default: 0 }, // ✅ ADD THIS
  },
  { timestamps: true }
);

export const Campaign = mongoose.model("Campaign", campaignSchema);
