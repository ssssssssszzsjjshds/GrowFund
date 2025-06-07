import { useEffect, useState } from "react";
import axios from "axios";
import CampaignCard from "./CampaignCard";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/campaigns");
        setCampaigns(res.data);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading campaigns...</p>;

  if (campaigns.length === 0) {
    return <p className="text-center text-gray-500">No campaigns available.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((c) => (
        <CampaignCard key={c._id} campaign={c} />
      ))}
    </div>
  );
};

export default CampaignList;
