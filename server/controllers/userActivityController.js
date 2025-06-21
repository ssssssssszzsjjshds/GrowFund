import Pledge from "../models/Pledge.js";

export async function getUserActivity(req, res) {
  try {
    const pledges = await Pledge.find({ userId: req.user._id || req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "campaignId",
        select: "title image", // add more fields if needed
      });

    // Defensive: campaignId can be null if campaign deleted
    const activity = pledges.map((pledge) => ({
      campaignId: pledge.campaignId?._id || null,
      campaignTitle: pledge.campaignId?.title || "[Deleted Campaign]",
      campaignImage: pledge.campaignId?.image || "",
      amount: pledge.amount,
      pledgedAt: pledge.createdAt,
    }));

    res.json(activity); // or { activity } if you want
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch activity", error: err.message });
  }
}
