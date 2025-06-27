import Pledge from "../models/Pledge.js";

export async function getUserActivity(req, res) {
  try {
    if (!req.user || !(req.user._id || req.user.id)) {
      return res.status(401).json({ msg: "Unauthorized: user not found" });
    }

    const pledges = await Pledge.find({ userId: req.user._id || req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "campaignId",
        select: "title image",
      });

    const activity = pledges.map((pledge) => ({
      campaignId: pledge.campaignId?._id || null,
      campaignTitle: pledge.campaignId?.title || "[Deleted Campaign]",
      campaignImage: pledge.campaignId?.image || "",
      amount: pledge.amount,
      pledgedAt: pledge.createdAt,
    }));

    res.json(activity);
  } catch (err) {
    console.error(err); // <--- see actual error in console
    res
      .status(500)
      .json({ msg: "Failed to fetch activity", error: err.message });
  }
}
