import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const CreateCampaign = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    description: "",
    goal: "",
    deadline: "",
    image: null,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    goal: Yup.number()
      .min(1, "Goal must be at least 1")
      .required("Goal is required"),
    deadline: Yup.date().required("Deadline is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("goal", values.goal);
      formData.append("deadline", values.deadline);
      if (values.image) {
        formData.append("image", values.image);
      }

      await axios.post("http://localhost:5000/api/campaigns", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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
            <Field
              name="title"
              placeholder="Title"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage name="title" component="div" className="text-red-500" />

            <Field
              as="textarea"
              name="description"
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage name="description" component="div" className="text-red-500" />

            <Field
              type="number"
              name="goal"
              placeholder="Goal Amount (AZN)"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage name="goal" component="div" className="text-red-500" />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setFieldValue("image", e.target.files[0])}
              className="w-full p-2 border rounded"
            />

            <Field
              type="date"
              name="deadline"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage name="deadline" component="div" className="text-red-500" />

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
    