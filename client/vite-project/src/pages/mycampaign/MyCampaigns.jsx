import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import CampaignCard from "../../components/CampaignCard";

const MyCampaigns = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/campaigns/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error("Failed to load your campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMyCampaigns();
  }, [token]);

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
