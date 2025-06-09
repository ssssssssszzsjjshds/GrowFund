import { Campaign } from "../models/Campaign.js";
import User from "../models/User.js";

// Save a campaign for the logged-in user
export const saveCampaign = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { campaignId } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Prevent duplicate saves
    if (user.savedCampaigns && user.savedCampaigns.includes(campaignId)) {
      return res.status(400).json({ msg: "Campaign already saved" });
    }

    user.savedCampaigns = user.savedCampaigns || [];
    user.savedCampaigns.push(campaignId);
    await user.save();

    res.status(200).json({ msg: "Campaign saved successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to save campaign", err });
  }
};

// Get all saved campaigns for the logged-in user
export const getSavedCampaigns = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).populate("savedCampaigns");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json(user.savedCampaigns || []);
  } catch (err) {
    res.status(500).json({ msg: "Failed to retrieve saved campaigns", err });
  }
};

// Unsave a campaign for the logged-in user
export const unsaveCampaign = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { campaignId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.savedCampaigns = (user.savedCampaigns || []).filter(
      (id) => id.toString() !== campaignId
    );
    await user.save();

    res.status(200).json({ msg: "Campaign unsaved successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to unsave campaign", err });
  }
};
