import { useNavigate } from "react-router";
import { CircularProgressbar } from "react-circular-progressbar";
import axios from "axios";
import { useCallback } from "react";

// Set your API base URL or use VITE_API_BASE_URL env var
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getProfilePicUrl = (picPath) => {
  if (!picPath) return "/default-profile.png";
  return picPath.startsWith("http") ? picPath : `${API_BASE_URL}${picPath}`;
};

const CampaignCard = ({ campaign, onSave, onUnsave, isSaved }) => {
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const timestamp = Date.now();

    try {
      await axios.post(`/api/campaigns/${campaign._id}/view`);

      navigate(`/campaigns/${campaign._id}`, {
        replace: true,
        state: {
          viewCounted: true,
          timestamp,
        },
      });
    } catch (err) {
      console.error("Error counting view:", err);
      navigate(`/campaigns/${campaign._id}`);
    }
  };

  const progress = parseFloat(
    (((campaign.raisedAmount || 0) / campaign.goal) * 100).toFixed(1)
  );

  // Expect campaign.creator to have at least {_id, profilePic, name}
  const creator = campaign.creator || {};
  const creatorProfileUrl = `/profile/${creator._id}`;
  const creatorImgUrl = getProfilePicUrl(creator.profilePic);

  return (
    <div
      className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition relative"
      onClick={handleClick}
    >
      <img
        src={`http://localhost:5000${campaign.image}`}
        alt={campaign.title}
        className="w-full h-40 object-cover mb-3 rounded"
      />
      <h3 className="text-lg font-semibold">{campaign.title}</h3>
      <p className="text-sm text-gray-700">{campaign.category}</p>
      <p className="text-sm text-gray-600">{campaign.description}</p>
      <p className="text-sm text-gray-500">{campaign.goal} AZN</p>
      <CircularProgressbar
        value={progress}
        text={`${progress}%`}
        className="mt-2 w-24 h-24"
      />
      <p className="text-sm text-gray-600 mt-2">{campaign.category}</p>

      {/* User Profile Pic & Link */}
      <a
        href={creatorProfileUrl}
        onClick={(e) => {
          e.stopPropagation();
          navigate(creatorProfileUrl);
        }}
        className="absolute bottom-4 left-4 flex items-center gap-2 group"
        title={`View ${creator.name || "user"}'s profile`}
      >
        <img
          src={creatorImgUrl}
          alt={creator.name || "User"}
          className="w-9 h-9 rounded-full object-cover border-2 border-blue-400 group-hover:ring-2 ring-blue-500 transition"
        />
        <span className="text-sm font-medium text-gray-700 group-hover:underline">
          {creator.name || "User"}
        </span>
      </a>

      {/* Save/Unsave Button */}
      {isSaved ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnsave(e, campaign._id);
          }}
          className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
          title="Unsave"
        >
          Unsave
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(e, campaign._id);
          }}
          className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
          title="Save"
        >
          Save
        </button>
      )}
    </div>
  );
};

export default CampaignCard;
