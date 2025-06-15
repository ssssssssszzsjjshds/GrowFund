import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * CreatedCampaignsMenuList
 * - Shows user's created campaigns in a fixed-height scrollable menu (max 5 visible)
 * - Keeps menu size consistent with a minimal custom scrollbar
 * - 50x50px image and campaign title per item
 * - Fully styled for use in a dropdown menu
 */
const API_BASE = "http://localhost:5000";

const CreatedCampaignsMenuList = ({ onItemClick }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch campaigns created by the user
    const fetchMyCampaigns = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/campaigns/my`, {
          withCredentials: true,
        });
        setCampaigns(res.data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load your campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCampaigns();
  }, []);

  if (loading) return <div className="text-xs text-gray-400">Loading...</div>;
  if (!campaigns.length)
    return <div className="text-xs text-gray-400">No campaigns yet</div>;

  return (
    <ul
      className="space-y-2 mt-2 max-h-[290px] overflow-y-auto pr-1"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#e5e7eb #fff",
      }}
    >
      {campaigns.map((camp) => (
        <li
          key={camp._id}
          className="flex items-center gap-2 p-1 cursor-pointer rounded hover:bg-gray-100 transition"
          onClick={() => onItemClick && onItemClick(camp._id)}
        >
          <img
            src={
              camp.image
                ? /^https?:\/\//.test(camp.image)
                  ? camp.image
                  : `http://localhost:5000${camp.image}`
                : "https://via.placeholder.com/50x50?text=No+Image"
            }
            alt={camp.title}
            className="w-[50px] h-[50px] rounded object-cover border"
          />
          <span className="text-sm text-gray-800 line-clamp-2">{camp.title}</span>
        </li>
      ))}
      {/* Custom scrollbar for Webkit browsers */}
      <style>{`
        ul::-webkit-scrollbar {
          width: 5px;
        }
        ul::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 4px;
        }
        ul::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </ul>
  );
};

export default CreatedCampaignsMenuList;