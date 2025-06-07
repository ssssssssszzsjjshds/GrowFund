// src/pages/AdminReview.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminReview = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCampaign = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/campaigns/${id}`);
      setCampaign(res.data);
    } catch (err) {
      console.error("Failed to fetch campaign", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/campaigns/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Campaign approved");
      navigate("/admin/review");
    } catch (err) {
      console.error("Approval failed", err);
      alert("Failed to approve campaign");
    }
  };

  const handleReject = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/campaigns/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Campaign rejected");
      navigate("/admin/review");
    } catch (err) {
      console.error("Rejection failed", err);
      alert("Failed to reject campaign");
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading campaign...</p>;
  if (!campaign)
    return <p className="text-center text-red-500">Campaign not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <img
        src={
          campaign.image
            ? `http://localhost:5000${campaign.image}`
            : "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={campaign.title}
        className="w-full h-60 object-cover rounded mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
      <p className="text-gray-600 mb-2">
        {new Date(campaign.deadline).toLocaleDateString()}
      </p>
      <p className="mb-4">{campaign.description}</p>
      <p className="text-sm text-gray-500 mb-2">
        Goal: {campaign.goal} AZN — Raised: {campaign.raisedAmount || 0} AZN
      </p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleApprove}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Approve
        </button>
        <button
          onClick={handleReject}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default AdminReview;
