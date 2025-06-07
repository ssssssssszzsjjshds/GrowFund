// src/components/AdminCampaignCard.jsx
import { Link } from "react-router";

const AdminCampaignCard = ({ campaign }) => {
  return (
    <Link
      to={`/admin/campaigns/${campaign._id}`}
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
