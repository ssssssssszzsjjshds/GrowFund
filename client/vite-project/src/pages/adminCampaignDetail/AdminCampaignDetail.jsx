import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const AdminCampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

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

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      toast.error("Failed to load comments");
    }
  };

  useEffect(() => {
    fetchCampaign();
    fetchComments();
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
      navigate("/admin"); // Redirect to admin panel
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete campaign");
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Comment deleted");
      fetchComments();
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading campaign...</p>;
  if (!campaign)
    return <p className="text-center text-red-500">Campaign not found</p>;

  const progress = Math.min(
    ((campaign.raisedAmount || 0) / campaign.goal) * 100,
    100
  ).toFixed(0);

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

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Campaign
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="border p-2 rounded mb-2 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800">{comment.content}</p>
                <p className="text-xs text-gray-500">
                  By {comment.user?.name || "Unknown"} on{" "}
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteComment(comment._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCampaignDetail;
