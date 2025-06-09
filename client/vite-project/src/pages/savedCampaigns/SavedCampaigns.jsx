import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { CircularProgressbar } from "react-circular-progressbar";

const API_BASE = "http://localhost:5000";

const SavedCampaigns = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/save-campaign`, {
          withCredentials: true,
        });
        setSaved(res.data);
      } catch (err) {
        setSaved([]);
        alert("You must be logged in to view saved campaigns.");
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const handleUnsave = async (e, campaignId) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_BASE}/api/save-campaign/${campaignId}`, {
        withCredentials: true,
      });
      setSaved((prev) => prev.filter((c) => c._id !== campaignId));
    } catch (err) {
      alert("Failed to unsave campaign.");
    }
  };

  if (loading) return <p className="p-4">Loading saved campaigns...</p>;
  if (saved.length === 0) return <p className="p-4">No saved campaigns found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Saved Campaigns</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {saved.map((c) => (
          <li
            key={c._id}
            className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition relative"
            onClick={() => navigate(`/campaigns/${c._id}`)}
          >
            <img
              src={`${API_BASE}${c.image}`}
              alt={c.title}
              className="w-full h-40 object-cover mb-3 rounded"
            />
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="text-sm text-gray-700">{c.category}</p>
            <p className="text-sm text-gray-600">{c.description}</p>
            <p className="text-sm text-gray-500">{c.goal} AZN</p>
            <CircularProgressbar
              value={parseFloat((((c.raisedAmount || 0) / c.goal) * 100).toFixed(1))}
              text={`${(((c.raisedAmount || 0) / c.goal) * 100).toFixed(1)}%`}
              className="mt-2 w-24 h-24"
            />
            <p className="text-sm text-gray-600 mt-2">{c.category}</p>
            {/* Unsave Button */}
            <button
              onClick={(e) => handleUnsave(e, c._id)}
              className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              title="Unsave"
            >
              Unsave
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedCampaigns;