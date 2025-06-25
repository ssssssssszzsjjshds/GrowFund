import User from "../models/User.js";
import { Campaign } from "../models/Campaign.js";

// GET all users (excluding password)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users", err });
  }
};

// Ban a user
export const banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User banned", user });
  } catch (err) {
    res.status(500).json({ msg: "Failed to ban user" });
  }
};

// Unban a user
export const unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User unbanned", user });
  } catch (err) {
    res.status(500).json({ msg: "Failed to unban user" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete user" });
  }
};

// GET all non-pending campaigns
export const getAllNonPendingCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: { $ne: "pending" } }).sort({
      createdAt: -1,
    });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET all pending campaigns for review
export const getPendingCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// PATCH: Approve campaign
export const approveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });
    res.json({ msg: "Campaign approved", campaign });
  } catch (err) {
    res.status(500).json({ msg: "Failed to approve campaign" });
  }
};

// PATCH: Reject campaign
export const rejectCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });
    res.json({ msg: "Campaign rejected", campaign });
  } catch (err) {
    res.status(500).json({ msg: "Failed to reject campaign" });
  }
};

// PUT: Update status (approved/rejected)
export const updateCampaignStatus = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    campaign.status = req.body.status; // "approved" or "rejected"
    await campaign.save();

    res.json({ msg: `Campaign ${campaign.status}` });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update campaign status" });
  }
};

// GET campaign by ID (admin only)
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    // Only allow admins
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
