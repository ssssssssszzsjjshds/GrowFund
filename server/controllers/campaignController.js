import { Campaign } from "../models/Campaign.js";
import fs from "fs";
import path from "path";
import { validCategories } from "../../shared/categories.js";

export const createCampaign = async (req, res) => {
  try {
    const { title, description, goal, deadline, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const numericGoal = Number(goal);
    if (isNaN(numericGoal) || numericGoal <= 0) {
      return res.status(400).json({ msg: "Goal must be a positive number" });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({ msg: "Invalid category selected" });
    }

    const status =
      numericGoal < 100 || numericGoal > 10000 ? "pending" : "approved";

    const campaign = new Campaign({
      title,
      description,
      goal: numericGoal,
      deadline,
      category,
      image,
      creator: req.user.id,
      status,
    });

    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const filter = {};
    const { search, userId, category, filter: filterType } = req.query;

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (userId) {
      filter.creator = userId;
    } else {
      filter.status = "approved";
    }

    let campaigns;

    if (filterType === "popular") {
      // Step 1: Try to find campaigns with >=100 views in the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      let popular = await Campaign.aggregate([
        { $match: filter },
        { $project: {
            title: 1,
            description: 1,
            goal: 1,
            raisedAmount: 1,
            views: 1,
            viewHistory: 1,
            image: 1,
            category: 1,
            creator: 1,
            createdAt: 1,
            recentViews: {
              $filter: {
                input: "$viewHistory",
                as: "view",
                cond: { $gte: ["$$view.timestamp", oneHourAgo] }
              }
            }
          }
        },
        { $addFields: { recentViewCount: { $size: "$recentViews" } } },
        { $match: { recentViewCount: { $gte: 100 } } },
        { $sort: { recentViewCount: -1 } }
      ]);

      if (popular.length > 0) {
        campaigns = popular;
      } else {
        // Step 2: Fallback to all-time most viewed
        campaigns = await Campaign.find(filter).sort({ views: -1 }).exec();
      }
    } else {
      // Default, most_viewed, most_recent, most_pledged, etc.
      let sort = { createdAt: -1 };
      if (filterType === "most_viewed") sort = { views: -1 };
      if (filterType === "most_pledged") sort = { raisedAmount: -1 };
      if (filterType === "most_recent") sort = { createdAt: -1 };

      campaigns = await Campaign.find(filter).sort(sort).exec();
    }

    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const getMyCampaigns = async (req, res) => {
  try {
    const userId = req.user.id;
    const campaigns = await Campaign.find({ creator: userId }).sort({
      createdAt: -1,
    });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch your campaigns" });
  }
};
export const getMostViewedCampaigns = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const campaigns = await Campaign.find({ status: "approved" })
      .select("+views")
      .sort({ views: -1 })
      .limit(limit);

    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch popular campaigns" });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    // First, find and update the campaign
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { views: 1 },
        $set: { lastViewedAt: new Date() },
      },
      {
        new: true,
        select: "+views +lastViewedAt", // Explicitly include these fields
      }
    );

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    if (
      campaign.status !== "approved" &&
      (!req.user || campaign.creator.toString() !== req.user.id)
    ) {
      return res.status(403).json({ msg: "Campaign not available" });
    }

    // For debugging
    console.log("Updated campaign:", {
      id: campaign._id,
      views: campaign.views,
      lastViewedAt: campaign.lastViewedAt,
    });

    res.json(campaign);
  } catch (err) {
    console.error("Error updating campaign views:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    const isOwner = campaign.creator.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to delete this campaign" });
    }

    if (campaign.image) {
      const imagePath = path.join("public", campaign.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn("Image not deleted:", err.message);
      });
    }

    await campaign.deleteOne();
    res.json({ msg: "Campaign deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    if (campaign.creator.toString() !== req.user.id)
      return res
        .status(403)
        .json({ msg: "Not authorized to update this campaign" });

    Object.assign(campaign, req.body);
    await campaign.save();

    res.json({ msg: "Campaign updated", campaign });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const recordView = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { views: 1 },
        $set: { lastViewedAt: new Date() },
      },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
