import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { loginUser } from "../../redux/slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      toast.dismiss(); // Clear any lingering toast messages
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleOAuthLogin = (provider) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Vite uses import.meta.env
    if (!backendUrl) {
      console.error("VITE_BACKEND_URL is not defined in your .env file");
      toast.error("Backend URL is not configured properly.");
      return;
    }
    window.location.href = `${backendUrl}/api/auth/${provider}`;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    toast.error("Use Facebook or Google to log in.");
  };

  return (
    <div className="max-w-md mx-auto mt-10 border p-4 rounded shadow space-y-4">
      <Toaster />
      <h2 className="text-2xl font-bold">Login</h2>
      <button
        onClick={() => handleOAuthLogin("google")}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full"
      >
        Login with Google
      </button>
      <button
        onClick={() => handleOAuthLogin("facebook")}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
      >
        Login with Facebook
      </button>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          disabled
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          disabled
        />
        <button
          type="submit"
          className="bg-gray-400 text-white py-2 px-4 rounded w-full cursor-not-allowed"
          disabled
        >
          Login (Disabled)
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
