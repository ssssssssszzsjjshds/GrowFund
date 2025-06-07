import { useEffect, useState } from "react";
import axios from "axios";
import CampaignCard from "./CampaignCard";

const CampaignList = ({ isAdmin = false }) => {
  const [campaignList, setCampaignList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/campaigns");
        setCampaignList(res.data);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading campaigns...</p>;

  if (campaignList.length === 0) {
    return <p className="text-center text-gray-500">No campaigns available.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaignList.map((c) => (
        <CampaignCard key={c._id} campaign={c} isAdmin={isAdmin} />
      ))}
    </div>
  );
};

export default CampaignList;
