import { useEffect, useState } from "react";
import axios from "axios";
import CampaignCardBig from "./CampaignCardBig";
import Carousel from "./CampaignCarousel";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const RecommendedList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const filter = "most_pledged";

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/campaigns`, {
          params: { filter },
          withCredentials: true,
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error("Error fetching campaigns", err);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/save-campaign`, {
          withCredentials: true,
        });
        setSavedCampaigns(res.data.map((c) => c._id || c));
      } catch (err) {
        setSavedCampaigns([]);
      }
    };
    fetchSaved();
  }, []);

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

  if (campaigns.length === 0) {
    return (
      <div className="text-center p-8">Loading recommended campaigns...</div>
    );
  }

  const [mostFunded, ...carouselCampaigns] = campaigns;

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full items-start justify-center pt-5">
      <div className="flex-1 min-w-[320px] max-w-[40vw]">
        <h2 className=" text-gray-600 mb-4 pl-4">Most Funded</h2>
        <CampaignCardBig
          campaign={mostFunded}
          isSaved={savedCampaigns.includes(mostFunded._id)}
          onSave={handleSave}
          onUnsave={handleUnsave}
          
        />
      </div>
      <div className="flex-1 min-w-[320px] max-w-[60vw]">
        <h2 className="text-gray-600 mb-4 pl-12">Featured Campaigns</h2>
        <Carousel
          campaigns={carouselCampaigns}
          savedCampaigns={savedCampaigns}
          onSave={handleSave}
          onUnsave={handleUnsave}
          cardsPerSlide={4}
          rowsPerSlide={2}
        />
      </div>
    </div>
  );
};

export default RecommendedList;
