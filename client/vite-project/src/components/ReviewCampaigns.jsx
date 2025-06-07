import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import AdminCampaignCard from "./AdminCampaignCard";

const ReviewCampaigns = () => {
  const { token } = useSelector((state) => state.auth);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/review-campaigns",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPending(res.data);
      } catch (err) {
        console.error("Failed to fetch pending campaigns", err);
      }
    };

    fetchPending();
  }, [token]);

  if (pending.length === 0) {
    return <p className="text-center text-gray-500">No pending campaigns.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Campaigns</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pending.map((c) => (
          <AdminCampaignCard key={c._id} campaign={c} isReviewPage={true} />
        ))}
      </div>
    </div>
  );
};

export default ReviewCampaigns;
