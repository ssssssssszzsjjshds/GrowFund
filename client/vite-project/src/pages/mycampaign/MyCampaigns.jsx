import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import CampaignCard from "../../components/CampaignCard";

const API_BASE = "http://localhost:5000";

const MyCampaigns = () => {
  const { user } = useSelector((state) => state.auth);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/campaigns/my`, {
          withCredentials: true,
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error("Failed to load your campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyCampaigns();
  }, [user]);

  if (loading) return <p>Loading your campaigns...</p>;
  if (!campaigns.length) return <p>You have not created any campaigns.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {campaigns.map((c) => (
        <CampaignCard key={c._id} campaign={c} />
      ))}
    </div>
  );
};

export default MyCampaigns;