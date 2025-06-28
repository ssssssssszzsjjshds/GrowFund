import { useEffect, useState } from "react";
import { validCategories, categoryLabels } from "../../../../shared/categories";
import CampaignCard from "./CampaignCard";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const CARDS_PER_SLIDE = 3;
const TOTAL_CARDS = 6;

function chunk(array, size) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}
function getRandomCategory() {
  return validCategories[Math.floor(Math.random() * validCategories.length)];
}

const RandomCategoryCarousel = () => {
  const [selectedCategory, setSelectedCategory] = useState(getRandomCategory());
  const [campaigns, setCampaigns] = useState([]);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [current, setCurrent] = useState(0);

  const sectionTitle =
    categoryLabels[selectedCategory] ||
    selectedCategory ||
    "Random Category Picks";

  // Fetch campaigns for selectedCategory
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/campaigns`, {
          params: { category: selectedCategory, filter: "most_recent" },
          withCredentials: true,
        });
        setCampaigns(res.data.slice(0, TOTAL_CARDS));
      } catch {
        setCampaigns([]);
      }
    };
    if (selectedCategory) fetchCampaigns();
  }, [selectedCategory]);

  // Fetch saved campaigns
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/save-campaign`, {
          withCredentials: true,
        });
        setSavedCampaigns(res.data.map((c) => c._id || c));
      } catch {
        setSavedCampaigns([]);
      }
    };
    fetchSaved();
  }, []);

  const slides = chunk(campaigns, CARDS_PER_SLIDE);

  const refreshCategory = () => setSelectedCategory(getRandomCategory());

  useEffect(() => setCurrent(0), [selectedCategory, slides.length]);

  // Save/unsave handlers (optional)
  const handleSave = async (e, campaignId) => {
    e.stopPropagation();
    try {
      await axios.post(
        `${API_BASE}/api/save-campaign`,
        { campaignId },
        { withCredentials: true }
      );
      setSavedCampaigns((prev) => [...prev, campaignId]);
    } catch {
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
    } catch {
      alert("Failed to unsave campaign.");
    }
  };

  return (
    <section className="py-12 bg-gray-50 rounded-lg shadow-md w-full max-w-7xl mx-auto mb-10 relative">
      <div className="flex justify-between items-center mb-6 px-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
            <span className="border-l-4 border-blue-500 pl-3">
              {sectionTitle}
            </span>
          </h2>
          <div className="text-gray-500 font-semibold">
            Category: <span className="text-blue-700">{selectedCategory}</span>
            <button
              onClick={refreshCategory}
              className="ml-4 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-semibold border border-blue-300 transition"
            >
              Refresh
            </button>
          </div>
        </div>
        {/* Progress bar (dots) at top right */}
        <div className="flex items-center justify-end w-[70px]">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 mx-1 rounded-full transition
                ${
                  current === idx
                    ? "bg-blue-600 scale-125"
                    : "bg-gray-300 hover:bg-blue-400"
                }
              `}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      {campaigns.length === 0 ? (
        <div className="text-gray-500 text-lg px-4 py-8 text-center">
          No campaigns found for this category.
        </div>
      ) : (
        <div className="px-4">
          <div
            className="overflow-x-clip"
            style={{ width: "100%", minHeight: "340px" }}
          >
            <div
              className="flex transition-transform duration-500"
              style={{
                width: `${100 * slides.length}%`,
                transform: `translateX(-${(100 / slides.length) * current}%)`,
              }}
            >
              {slides.map((slide, slideIdx) => (
                <div
                  key={slideIdx}
                  className="flex gap-4 items-stretch"
                  style={{ minWidth: `${100 / slides.length}%` }}
                >
                  {slide.map((c, idx) =>
                    c ? (
                      <CampaignCard
                        key={c._id}
                        campaign={c}
                        isSaved={savedCampaigns?.includes(c._id)}
                        onSave={handleSave}
                        onUnsave={handleUnsave}
                      />
                    ) : (
                      <div key={idx} className="flex-1" />
                    )
                  )}
                  {/* Pad with empty divs if needed */}
                  {slide.length < CARDS_PER_SLIDE &&
                    Array(CARDS_PER_SLIDE - slide.length)
                      .fill(0)
                      .map((_, idx) => <div key={idx} className="flex-1" />)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RandomCategoryCarousel;
