import Pledge from "../models/Pledge.js";
import { Campaign } from "../models/Campaign.js";
import User from "../models/User.js";

export const createPledge = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId || !amount) {
      return res.status(400).json({ msg: "Campaign ID and amount required" });
    }
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ msg: "Amount must be a positive number" });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    // Prevent pledging to own campaign
    if (campaign.creator.toString() === req.user.id)
      return res
        .status(400)
        .json({ msg: "Cannot pledge to your own campaign" });

    // Find user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Check balance
    if (user.balance < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    // Deduct balance
    user.balance -= parseFloat(amount);
    await user.save();

    // Create pledge
    const pledge = await Pledge.create({
      userId: req.user.id,
      campaignId,
      amount,
    });

    // Update campaign raisedAmount
    await Campaign.updateOne(
      { _id: campaignId },
      { $inc: { raisedAmount: parseFloat(amount) } }
    );

    res.status(201).json({
      pledge,
      newBalance: user.balance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", err });
  }
};