import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const CommentSection = () => {
  const { id: campaignId } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/comments/${campaignId}`
      );
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [campaignId]);

 const handleAddComment = async (e) => {
  e.preventDefault();

  if (!newComment.trim()) return;

  try {
    await axios.post(
      `http://localhost:5000/api/comments`,
      { campaignId, content: newComment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setNewComment("");
    fetchComments(); // Refresh comments after successful post
  } catch (err) {
    if (err.response?.status === 401) {
      toast.error("You must be logged in to comment.");
    } else {
      toast.error("Failed to add comment.");
    }
    console.error("Failed to add comment", err);
  }
};

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchComments();
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return (
    <div className="mt-8">
      <Toaster />
      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="Add a comment..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </form>
      <div className="space-y-2">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="border p-3 rounded flex justify-between items-start"
          >
            <div>
              <p className="text-sm font-semibold">{comment.userId?.name}</p>
              <p>{comment.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
            {user?._id === comment.userId?._id && (
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
