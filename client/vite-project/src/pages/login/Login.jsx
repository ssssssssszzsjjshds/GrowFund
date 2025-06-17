import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router"; // <-- add useLocation
import toast, { Toaster } from "react-hot-toast";
import { loginUser } from "../../redux/slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // <-- add this
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      toast.dismiss(); // Clear any lingering toast messages
      // Read "from" location if redirected by PrivateRoute
      const from = location.state?.from?.pathname;
      if (user.role === "admin") {
        navigate("/admin");
      } else if (from && from !== "/login") {
        navigate(from, { replace: true });
      } else {
        navigate("/");
      }
    }
  }, [user, navigate, location.state]);

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
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 border p-4 rounded shadow space-y-4">
      <Toaster />
      <h2 className="text-2xl font-bold">Login</h2>
      <button
        onClick={() => handleOAuthLogin("google")}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full"
        disabled={loading}
      >
        Login with Google
      </button>
      <button
        onClick={() => handleOAuthLogin("facebook")}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
        disabled={loading}
      >
        Login with Facebook
      </button>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
        />
        <button
          type="submit"
          className={`py-2 px-4 rounded w-full ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
