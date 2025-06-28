import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Carousel from "./CampaignCarousel"; // or your own carousel component

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const FRESH_DAYS = 15;
const MAX_CAMPAIGNS = 15;
const CARDS_PER_SLIDE = 3;

function isFresh(createdAt) {
  const createdDate = new Date(createdAt);
  const today = new Date();
  const diffMs = today - createdDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= FRESH_DAYS;
}

const FreshFavorites = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [savedCampaigns, setSavedCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/campaigns`, {
          params: { sort: "createdAt", order: "desc" },
          withCredentials: true,
        });
        setCampaigns(res.data);
      } catch (err) {
        setCampaigns([]);
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

  // Filtering is done after fetch
  const freshCampaigns = useMemo(
    () =>
      campaigns
        .filter(
          (c) =>
            c.createdAt &&
            c.status === "approved" &&
            Math.floor(
              (new Date() - new Date(c.createdAt)) / (1000 * 60 * 60 * 24)
            ) <= 15
        )
        .slice(0, MAX_CAMPAIGNS),
    [campaigns]
  );

  // Optionally, add save/unsave handlers if you want them for this list
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

  return (
    <section className="py-12 bg-gray-50 rounded-lg shadow-md w-full max-w-7xl mx-auto mb-10">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 pl-4">
        <span className="border-l-4 border-blue-500 pl-3">Fresh Favorites</span>
      </h2>
      {freshCampaigns.length === 0 ? (
        <div className="text-gray-500 text-lg px-4 py-8 text-center">
          No fresh campaigns found.
        </div>
      ) : (
        <div className="px-4">
          <Carousel
            campaigns={freshCampaigns}
            savedCampaigns={savedCampaigns}
            onSave={handleSave}
            onUnsave={handleUnsave}
            cardsPerSlide={CARDS_PER_SLIDE}
            rowsPerSlide={1}
          />
        </div>
      )}
    </section>
  );
};

export default FreshFavorites;
