import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      toast.dismiss(); // Clear any lingering toast messages
      toast.error("You're already logged in.");
      navigate("/");
    }
  }, [user, navigate]);

  const handleOAuthRegister = (provider) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Vite uses import.meta.env
    if (!backendUrl) {
      console.error("VITE_BACKEND_URL is not defined in your .env file");
      toast.error("Backend URL is not configured properly.");
      return;
    }
    window.location.href = `${backendUrl}/api/auth/${provider}`;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error("VITE_BACKEND_URL is not defined in your .env file");
        toast.error("Backend URL is not configured properly.");
        setLoading(false);
        return;
      }
      const response = await axios.post(`${backendUrl}/api/auth/register`, formData);
      toast.success("Registered successfully!");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.msg || "Failed to register manually.";
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 border p-4 rounded shadow space-y-4">
      <Toaster />
      <h2 className="text-2xl font-bold">Register</h2>
      {/* OAuth Buttons */}
      <button
        onClick={() => handleOAuthRegister("google")}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full"
        disabled={loading}
      >
        Register with Google
      </button>
      <button
        onClick={() => handleOAuthRegister("facebook")}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
        disabled={loading}
      >
        Register with Facebook
      </button>

      {/* Manual Registration Form */}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          required
          disabled={loading}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
          disabled={loading}
        />
        <button
          type="submit"
          className={`bg-green-500 text-white py-2 px-4 rounded w-full ${
            loading ? "cursor-not-allowed opacity-50" : "hover:bg-green-600"
          }`}
          disabled={loading}
        >
          Register Manually
        </button>
      </form>
    </div>
  );
};

export default Register;