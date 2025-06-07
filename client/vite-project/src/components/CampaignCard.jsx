import { Link } from "react-router";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CampaignCard = ({ campaign, isAdmin = false }) => {
  const progress = Math.min(
    ((campaign.raisedAmount || 0) / campaign.goal) * 100,
    100
  ).toFixed(0);
  const path = isAdmin
    ? `/admin/campaigns/${campaign._id}`
    : `/campaigns/${campaign._id}`;
  return (
    <Link
      to={`/campaigns/${campaign._id}`}
      className="border p-4 rounded shadow hover:shadow-md transition"
    >
      {campaign.image && (
        <img
          src={
            campaign.image
              ? `http://localhost:5000${campaign.image}`
              : "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={campaign.title}
          className="w-full h-40 object-cover mb-3 rounded"
        />
      )}

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{campaign.title}</h2>
        <div className="w-12 h-12">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textSize: "28px",
              pathColor: "#3b82f6", // Tailwind blue-600
              textColor: "#1f2937", // Tailwind gray-800
              trailColor: "#e5e7eb", // Tailwind gray-200
            })}
          />
        </div>
      </div>
      {campaign.status !== "approved" && (
        <span className="text-yellow-600 font-medium">
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </span>
      )}

      <p className="text-sm text-gray-600 mb-1">
        Deadline: {new Date(campaign.deadline).toLocaleDateString()}
      </p>
      <p className="text-gray-700 mb-2">
        {campaign.description.slice(0, 80)}...
      </p>
      <p className="text-blue-600 font-medium">Goal: {campaign.goal} AZN</p>
    </Link>
  );
};

export default CampaignCard;
