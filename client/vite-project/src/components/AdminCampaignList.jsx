import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";
import CampaignCard from "./CampaignCard";

const API_BASE = "http://localhost:5000";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get("category");

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/campaigns`, {
          params: { category },
          withCredentials: true,
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error("Error fetching campaigns", err);
      }
    };
    fetchCampaigns();
  }, [category]);

  // Fetch saved campaigns for the logged-in user
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/save-campaign`, {
          withCredentials: true,
        });
        setSavedCampaigns(res.data.map(c => c._id || c));
      } catch (err) {
        setSavedCampaigns([]);
      }
    };
    fetchSaved();
  }, []);

  // Save a campaign
  const handleSave = async (e, campaignId) => {
    e.stopPropagation();
    try {
      await axios.post(
        `${API_BASE}/api/save-campaign`,
        { campaignId },
        { withCredentials: true }
      );
      setSavedCampaigns((prev) => [...prev, campaignId]);
    } catch (err) {
      alert("You must be logged in to save campaigns.");
    }
  };

  // Unsave a campaign
  const handleUnsave = async (e, campaignId) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_BASE}/api/save-campaign/${campaignId}`, {
        withCredentials: true,
      });
      setSavedCampaigns((prev) => prev.filter((id) => id !== campaignId));
    } catch (err) {
      alert("Failed to unsave campaign.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {category ? `Category: ${category}` : "All Campaigns"}
      </h2>
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onSave={handleSave}
              onUnsave={handleUnsave}
              isSaved={savedCampaigns.includes(campaign._id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CampaignList;