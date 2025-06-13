import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import axios from "../../axiosInstance";

const emptyTextBlock = { type: "text", content: "", order: 0 };
const emptyImageBlock = { type: "image", content: "", order: 0 };

// You may want to move your backend API URL to an env variable in prod
const API_BASE_URL = "http://localhost:5000";

const CampaignEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
    deadline: "",
  });
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/campaigns/${id}`);
        setForm({
          title: res.data.title,
          description: res.data.description,
          goal: res.data.goal,
          deadline: res.data.deadline.slice(0, 10), // YYYY-MM-DD
        });
        // Load blocks, order them just in case
        setBlocks(Array.isArray(res.data.blocks) ? [...res.data.blocks].sort((a, b) => a.order - b.order) : []);
        setLoading(false);
      } catch (err) {
        alert("Failed to load campaign");
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  // Block logic (add/remove/update)
  const addTextBlock = () => {
    setBlocks([
      ...blocks,
      { ...emptyTextBlock, order: blocks.length },
    ]);
  };

  const addImageBlock = () => {
    setBlocks([
      ...blocks,
      { ...emptyImageBlock, order: blocks.length },
    ]);
  };

  const removeBlock = idx => {
    setBlocks(
      blocks.filter((_, i) => i !== idx).map((b, i) => ({ ...b, order: i }))
    );
  };

  const updateBlockContent = (idx, content) => {
    setBlocks(
      blocks.map((block, i) =>
        i === idx ? { ...block, content } : block
      )
    );
  };

  const handleImageInput = (idx, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateBlockContent(idx, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // PATCH: update fields + blocks
      await axios.patch(
        `${API_BASE_URL}/api/campaigns/${id}`,
        {
          ...form,
          blocks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/campaigns/${id}`);
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />
        <input
          type="number"
          name="goal"
          placeholder="Goal"
          value={form.goal}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Blocks UI */}
        <div>
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={addTextBlock}
            >
              Add Text
            </button>
            <button
              type="button"
              className="bg-indigo-600 text-white px-3 py-1 rounded"
              onClick={addImageBlock}
            >
              Add Image
            </button>
          </div>
          {blocks.length > 0 && (
            <div className="mb-4 space-y-2">
              {blocks.map((block, idx) => (
                <div key={idx} className="border p-2 rounded relative">
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() => removeBlock(idx)}
                    title="Remove block"
                  >
                    &times;
                  </button>
                  {block.type === "text" ? (
                    <textarea
                      className="w-full p-2 border rounded"
                      value={block.content}
                      onChange={e => updateBlockContent(idx, e.target.value)}
                      placeholder="Enter text..."
                      rows={3}
                    />
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e =>
                          e.target.files[0] && handleImageInput(idx, e.target.files[0])
                        }
                      />
                      {block.content && (
                        <img
                          src={block.content}
                          alt="Block"
                          className="max-w-full h-32 object-cover mt-2"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default CampaignEdit;