import { useNavigate } from "react-router";
import { CircularProgressbar } from "react-circular-progressbar";
import axios from "axios";
import { useCallback } from "react";

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
        timestamp 
      }
    });
  } catch (err) {
    console.error("Error counting view:", err);
    navigate(`/campaigns/${campaign._id}`);
  }
};

  const progress = parseFloat(
    (((campaign.raisedAmount || 0) / campaign.goal) * 100).toFixed(1)
  );

  return (
    <div // Changed from li to div to better control click events
      className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition relative"
      onClick={handleClick}
    >
      <img
        src={campaign.image}
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
