import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";
import FilterBar from "../../../../shared/FilterBar";
import CampaignCard from "./CampaignCard";

const API_BASE = "http://localhost:5000";

const CategoryCampaignsList = ({ category: categoryProp }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [filter, setFilter] = useState("most_viewed");
  const [selectedCategory, setSelectedCategory] = useState(categoryProp || "");
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  // If you want to define what is home page:
  const isHomePage = location.pathname === "/" && !selectedCategory;

  // Keep category in sync with navbar and url
  useEffect(() => {
    if (categoryProp) {
      setSelectedCategory(categoryProp);
    } else if (query.get("category")) {
      setSelectedCategory(query.get("category"));
    }
  }, [categoryProp, location.search]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/campaigns`, {
          params: { category: selectedCategory, filter },
          withCredentials: true,
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error("Error fetching campaigns", err);
      }
    };
    fetchCampaigns();
  }, [selectedCategory, filter]);

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
    <div>
      {/* Remove extra flex, z-index, and height here */}
      {!isHomePage && (

         <div className="flex items-center justify-between  p-10">
        <FilterBar
          selectedCategory={selectedCategory}
          setCategory={setSelectedCategory}
          filter={filter}
          setFilter={setFilter}
        
        /></div>
      )}

      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {campaigns.map((c) => (
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

export default CategoryCampaignsList;
