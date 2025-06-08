import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get("category");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/campaigns", {
          params: {
            category, // Pass category as a query parameter
          },
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error("Error fetching campaigns", err);
      }
    };

    fetchCampaigns();
  }, [category]); // Refetch when category changes

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {category ? `Category: ${category}` : "All Campaigns"}
      </h2>
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <li key={c._id} className="border p-4 rounded shadow">
              <img src={`http://localhost:5000${c.image}`} alt={c.title} className="w-full h-40 object-cover mb-3 rounded" />
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-sm">{c.category}</p>
              <p className="text-sm">{c.description}</p>
              <p className="text-sm text-gray-500">{c.goal} AZN</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CampaignList;
