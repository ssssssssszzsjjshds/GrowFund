import { useEffect, useState } from "react";
import axios from "../axiosInstance";
import CampaignCard from "./CampaignCard";

const NewestCampaigns = ({ count = 6 }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("/api/campaigns");
        // Sort by creation date descending (newest first)
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

  if (loading) return <p className="text-center mt-10">Loading campaigns...</p>;
  if (campaigns.length === 0) {
    return <p className="text-center text-gray-500">No campaigns found.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Newest Campaigns</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map(c => (
          <CampaignCard key={c._id} campaign={c} />
        ))}
      </div>
    </div>
  );
};

export default NewestCampaigns;