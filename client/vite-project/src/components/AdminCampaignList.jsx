// src/components/AdminCampaignList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AdminCampaignCard from "./AdminCampaignCard";
import { useSelector } from "react-redux";

const AdminCampaignList = () => {
  const { token } = useSelector((state) => state.auth);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/campaigns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // ✅ Filter out rejected campaigns
        const filtered = res.data.filter(c => c.status !== "rejected");
        setCampaigns(filtered);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [token]);

  if (loading) return <p className="text-center mt-10">Loading campaigns...</p>;

  if (campaigns.length === 0) {
    return <p className="text-center text-gray-500">No campaigns available.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((c) => (
        <AdminCampaignCard key={c._id} campaign={c} />
      ))}
    </div>
  );
};

export default AdminCampaignList;
