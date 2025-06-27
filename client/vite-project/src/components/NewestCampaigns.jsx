import { useEffect, useState } from "react";
import axios from "../axiosInstance";
import CampaignCard from "./CampaignCard";

const NewestCampaigns = ({ count }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("/api/campaigns");
        

        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCampaigns(sorted.slice(0, count));
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [count]);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get("/api/save-campaign", {
          withCredentials: true,
        });
        setSavedCampaigns(res.data.map((c) => c._id || c));
      } catch (err) {
        console.error("Failed to fetch saved campaigns", err);
        setSavedCampaigns([]);
      }
    };
    fetchSaved();
  }, []);

  const handleSave = async (e, campaignId) => {
    e.stopPropagation();
    try {
      await axios.post(
        "/api/save-campaign",
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
      await axios.delete(`/api/save-campaign/${campaignId}`, {
        withCredentials: true,
      });
      setSavedCampaigns((prev) => prev.filter((id) => id !== campaignId));
    } catch (err) {
      alert("Failed to unsave campaign.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading campaigns...</p>;
  if (campaigns.length === 0) {
    return <p className="text-center text-gray-500">No campaigns found.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Newest Campaigns</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => (
          <CampaignCard
            key={c._id}
            campaign={c}
            isSaved={savedCampaigns.includes(c._id)}
            onSave={handleSave}
            onUnsave={handleUnsave}
          />
        ))}
      </div>
    </div>
  );
};

export default NewestCampaigns;
