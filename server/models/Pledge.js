import mongoose from "mongoose";

const pledgeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Pledge must be at least 1 AZN"],
    },
  },
  { timestamps: true }
);

const Pledge = mongoose.model("Pledge", pledgeSchema);

export default Pledge;
