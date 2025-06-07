// pages/explore/Explore.jsx
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import CampaignCard from "../../components/CampaignCard";

const Explore = () => {
  const [params] = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = params.get("search") || "";

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/campaigns", {
          params: { search },
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error("Error fetching campaigns", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">
        Search Results {search && `for "${search}"`}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard key={c._id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
