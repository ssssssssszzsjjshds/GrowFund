import User from "../models/User.js";

// Search users by name, excluding self
export const searchUsersByName = async (req, res) => {
  try {
    const query = req.query.q || "";
    if (!query) return res.json([]);
    const users = await User.find({
      name: { $regex: query, $options: "i" },
      _id: { $ne: req.user.id }
    }).select("_id name avatar");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to search users" });
  }
};