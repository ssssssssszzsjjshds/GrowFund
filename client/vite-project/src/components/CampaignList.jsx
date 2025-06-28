import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";
import FilterBar from "../../../../shared/FilterBar";
import CampaignCard from "./CampaignCard"; // import the reusable card
import CampaignCardBig from "./CampaignCardBig";

const API_BASE = "http://localhost:5000";

const CampaignList = ({ category: categoryProp }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [filter, setFilter] = useState("most_recent");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = categoryProp ?? query.get("category");
  const isHomePage = location.pathname === "/" && !category;

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

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/save-campaign`, {
          withCredentials: true,
        });
        setSavedCampaigns(res.data.map((c) => c._id || c));
      } catch (err) {
        setSavedCampaigns([]);
      }
    };
    fetchSaved();
  }, []);

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
      {!isHomePage && <FilterBar filter={filter} setFilter={setFilter} />}
      {!isHomePage && <div>Current filter: {filter}</div>}
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Render the first campaign as a big card if available */}
          {campaigns[0] && (
            <li
              key={campaigns[0]._id}
              className="col-span-1 md:col-span-2 lg:col-span-3"
            >
              <CampaignCardBig
                campaign={campaigns[0]}
                isSaved={savedCampaigns.includes(campaigns[0]._id)}
                onSave={handleSave}
                onUnsave={handleUnsave}
              />
            </li>
          )}
          {/* Render the rest as normal cards */}
          {campaigns.slice(1).map((c) => (
            <li key={c._id}>
              <CampaignCard
                campaign={c}
                isSaved={savedCampaigns.includes(c._id)}
                onSave={handleSave}
                onUnsave={handleUnsave}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CampaignList;
