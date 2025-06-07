import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { pledgeToCampaign } from "../../redux/slices/pledgeSlice";
import toast, { Toaster } from "react-hot-toast";
import CommentSection from "../../components/CommentSection";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");

  const fetchCampaign = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/campaigns/${id}`);
      setCampaign(res.data);
    } catch (err) {
      console.error("Failed to load campaign", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/campaigns/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete campaign");
    }
  };

  const handlePledge = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || amount <= 0) {
      return alert("Please enter a valid amount");
    }

    try {
      await dispatch(
        pledgeToCampaign({ campaignId: id, amount, token })
      ).unwrap();
      toast.success("Pledged successfully");

      // Fetch updated campaign data from backend
      fetchCampaign();

      setAmount("");
    } catch (err) {
      alert(err?.msg || "Failed to pledge");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading campaign...</p>;
  if (!campaign)
    return <p className="text-center text-red-500">Campaign not found</p>;

  const progress = Math.min(
    ((campaign.raisedAmount || 0) / campaign.goal) * 100,
    100
  ).toFixed(0);

  const isOwner = user?._id === campaign?.creator;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Toaster />
      <img
        src={
          campaign.image
            ? `http://localhost:5000${campaign.image}`
            : "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={campaign.title}
        className="w-full h-60 object-cover rounded mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
      <p className="text-gray-600 mb-4">
        {new Date(campaign.deadline).toLocaleDateString()}
      </p>
      <p className="mb-4">{campaign.description}</p>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {campaign.raisedAmount || 0} AZN raised of {campaign.goal} AZN
      </p>

      {!isOwner && user && (
        <form onSubmit={handlePledge} className="mb-4">
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter amount (AZN)"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Pledge
            </button>
          </div>
        </form>
      )}

      {isOwner && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate(`/campaigns/${id}/edit`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Campaign
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Campaign
          </button>
        </div>
      )}
      <div className="mt-4"><CommentSection campaignId={id} /></div>
    </div>
  );
};

export default CampaignDetail;
