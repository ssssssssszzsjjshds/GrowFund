import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const AdminReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCampaign = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/campaigns/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCampaign(res.data);
    } catch (err) {
      console.error("Failed to load campaign", err);
      setError("Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const handleApprove = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/campaigns/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Campaign approved");
      navigate("/admin/review");
    } catch (err) {
      toast.error("Failed to approve campaign");
    }
  };

  const handleReject = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/campaigns/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Campaign rejected");
      navigate("/admin/review");
    } catch (err) {
      toast.error("Failed to reject campaign");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading campaign...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!campaign) return null;

  const progress = Math.min(
    ((campaign.raisedAmount || 0) / campaign.goal) * 100,
    100
  ).toFixed(0);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Toaster />
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
      <p className="text-gray-600 mb-4">
        Deadline: {new Date(campaign.deadline).toLocaleDateString()}
      </p>
      <p className="mb-4">{campaign.description}</p>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        {campaign.raisedAmount || 0} AZN raised of {campaign.goal} AZN
      </p>

      <div className="flex gap-4">
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

export default AdminReviewDetail;
