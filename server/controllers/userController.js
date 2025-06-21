import User from "../models/User.js";

// Search users by name, excluding self
export const searchUsersByName = async (req, res) => {
  try {
    const query = req.query.q || "";
    if (!query) return res.json([]);
    const users = await User.find({
      name: { $regex: query, $options: "i" },
      _id: { $ne: req.user.id },
    }).select("_id name avatar");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to search users" });
  }
};

import { Campaign } from "../models/Campaign.js"; // or whatever your campaign model is called

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // Fetch user and select social links
    const user = await User.findById(userId).select(
      "name instagram facebook linkedin portfolio"
    );

    // Fetch user's created projects/campaigns
    const createdProjects = await Campaign.find({ creator: userId }).select(
      "title image"
    );

    res.json({
      name: user.name,
      instagram: user.instagram,
      facebook: user.facebook,
      linkedin: user.linkedin,
      portfolio: user.portfolio,
      createdProjects,
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch profile", error: err.message });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name instagram facebook linkedin portfolio"
    );
    if (!user) return res.status(404).json({ msg: "User not found" });

    const createdProjects = await Campaign.find({
      creator: req.params.id,
    }).select("title image");

    res.json({
      name: user.name,
      instagram: user.instagram,
      facebook: user.facebook,
      linkedin: user.linkedin,
      portfolio: user.portfolio,
      createdProjects,
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch public profile", error: err.message });
  }
};
