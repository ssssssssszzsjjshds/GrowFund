import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import { useLocation, useNavigate } from "react-router";
import FilterBar from "../../../../shared/FilterBar";

const API_BASE = "http://localhost:5000";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [filter, setFilter] = useState("most_recent");
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const category = query.get("category");

  // Determine if we are on the home page ("/")
 const isHomePage = location.pathname === "/" && !category;

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/campaigns`, {
          params: { category, filter },
          withCredentials: true,
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error("Error fetching campaigns", err);
      }
    };
    fetchCampaigns();
  }, [category, filter]);

  // Fetch saved campaigns for the logged-in user
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/save-campaign`, {
          withCredentials: true,
        });
        setSavedCampaigns(res.data.map(c => c._id || c));
      } catch (err) {
        setSavedCampaigns([]);
      }
    };
    fetchSaved();
  }, []);

  // Save a campaign
  const handleSave = async (e, campaignId) => {
    e.stopPropagation();
    try {
      await axios.post(
        `${API_BASE}/api/save-campaign`,
        { campaignId },
        { withCredentials: true }
      );
      setSavedCampaigns((prev) => [...prev, campaignId]);
    } catch (err) {
      alert("You must be logged in to save campaigns.");
    }
  };

  // Unsave a campaign
  const handleUnsave = async (e, campaignId) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_BASE}/api/save-campaign/${campaignId}`, {
        withCredentials: true,
      });
      setSavedCampaigns((prev) => prev.filter((id) => id !== campaignId));
    } catch (err) {
      alert("Failed to unsave campaign.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {category ? `Category: ${category}` : "All Campaigns"}
      </h2>
      {/* Only show FilterBar if NOT home page */}
      {!isHomePage && (
        <FilterBar filter={filter} setFilter={setFilter} />
      )}
      {/* You can remove this line if you don't want to show filter info */}
      {!isHomePage && <div>Current filter: {filter}</div>}
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <li
              key={c._id}
              className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition relative"
              onClick={() => navigate(`/campaigns/${c._id}`)}
            >
              <img
                src={`http://localhost:5000${c.image}`}
                alt={c.title}
                className="w-full h-40 object-cover mb-3 rounded"
              />
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-700">{c.category}</p>
              <p className="text-sm text-gray-600">{c.description}</p>
              <p className="text-sm text-gray-500">{c.goal} AZN</p>
              <CircularProgressbar
                value={parseFloat(
                  (((c.raisedAmount || 0) / c.goal) * 100).toFixed(1)
                )}
                text={`${(((c.raisedAmount || 0) / c.goal) * 100).toFixed(1)}%`}
                className="mt-2 w-24 h-24"
              />
              <p className="text-sm text-gray-600 mt-2">{c.category}</p>

              {savedCampaigns.includes(c._id) ? (
                <button
                  onClick={(e) => handleUnsave(e, c._id)}
                  className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  title="Unsave"
                >
                  Unsave
                </button>
              ) : (
                <button
                  onClick={(e) => handleSave(e, c._id)}
                  className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                  title="Save"
                >
                  Save
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CampaignList;