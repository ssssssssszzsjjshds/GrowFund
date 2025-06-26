import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../axiosInstance.js";
import { useNavigate } from "react-router";
import { categories } from "../../../../../shared/categories.js";
import { useSelector } from "react-redux";

const emptyTextBlock = { type: "text", content: "", order: 0 };
const emptyImageBlock = { type: "image", content: "", order: 0 };

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const user = useSelector((state) => state.auth.user);

  // Conditional rendering if user is banned
  if (user?.isBanned) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-700">You are banned</h2>
        <p className="mb-6 text-gray-600">
          Your account has been banned. You cannot create new campaigns. You are
          still able to view existing campaigns and fund them.
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Add text block
  const addTextBlock = () => {
    setBlocks([...blocks, { ...emptyTextBlock, order: blocks.length }]);
  };

  // Add image block
  const addImageBlock = () => {
    setBlocks([...blocks, { ...emptyImageBlock, order: blocks.length }]);
  };

  // Remove block
  const removeBlock = (idx) => {
    setBlocks(
      blocks.filter((_, i) => i !== idx).map((b, i) => ({ ...b, order: i }))
    );
  };

  // Update block content
  const updateBlockContent = (idx, content) => {
    setBlocks(
      blocks.map((block, i) => (i === idx ? { ...block, content } : block))
    );
  };

  // If image: handle file input and store as Data URL
  const handleImageInput = (idx, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateBlockContent(idx, reader.result); // Store as base64 for this demo; in prod, upload and use URL
    };
    reader.readAsDataURL(file);
  };

  const initialValues = {
    title: "",
    description: "",
    goal: "",
    deadline: "",
    category: "",
    image: null,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    goal: Yup.number()
      .min(1, "Goal must be at least 1")
      .required("Goal is required"),
    deadline: Yup.date().required("Deadline is required"),
    category: Yup.string()
      .oneOf(categories, "Invalid category")
      .required("Category is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("goal", values.goal);
      formData.append("deadline", values.deadline);
      formData.append("category", values.category);
      if (values.image) {
        formData.append("image", values.image);
      }
      // ADD blocks as JSON string
      formData.append("blocks", JSON.stringify(blocks));

      await axios.post("/api/campaigns", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Campaign</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-4" encType="multipart/form-data">
            {/* Title */}
            <Field
              name="title"
              placeholder="Title"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-red-500"
            />

            {/* Description */}
            <Field
              as="textarea"
              name="description"
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500"
            />

            {/* Campaign Icon */}
            <div>
              <label className="block mb-1 font-semibold">Icon</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setFieldValue("image", e.target.files[0])}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Dynamic Content Blocks */}
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
                          onChange={(e) =>
                            updateBlockContent(idx, e.target.value)
                          }
                          placeholder="Enter text..."
                          rows={3}
                        />
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              e.target.files[0] &&
                              handleImageInput(idx, e.target.files[0])
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

            {/* Goal */}
            <Field
              type="number"
              name="goal"
              placeholder="Goal Amount (AZN)"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="goal"
              component="div"
              className="text-red-500"
            />

            {/* Deadline */}
            <Field
              type="date"
              name="deadline"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="deadline"
              component="div"
              className="text-red-500"
            />

            {/* Category */}
            <Field
              as="select"
              name="category"
              className="w-full p-2 border rounded bg-white"
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="category"
              component="div"
              className="text-red-500"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateCampaign;
