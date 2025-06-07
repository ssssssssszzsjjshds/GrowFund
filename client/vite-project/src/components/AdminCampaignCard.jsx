// src/components/AdminCampaignCard.jsx
import { Link } from "react-router"; // <-- Use react-router-dom, not just react-router

const AdminCampaignCard = ({ campaign, isReviewPage = false }) => {
  const linkPath = isReviewPage
    ? `/admin/review/${campaign._id}`
    : `/admin/campaigns/${campaign._id}`;

  return (
    <Link
      to={linkPath}
      className="border p-4 rounded shadow hover:shadow-md transition"
    >
      {campaign.image && (
        <img
          src={`http://localhost:5000${campaign.image}`}
          alt={campaign.title}
          className="w-full h-40 object-cover mb-3 rounded"
        />
      )}
      <h2 className="text-xl font-semibold">{campaign.title}</h2>
      <p className="text-sm text-gray-600 mb-1">
        Deadline: {new Date(campaign.deadline).toLocaleDateString()}
      </p>
      <p className="text-blue-600 font-medium">Goal: {campaign.goal} AZN</p>
      <p className="text-sm text-gray-600">
        Raised: {campaign.raisedAmount || 0} AZN
      </p>
    </Link>
  );
};

export default AdminCampaignCard;
