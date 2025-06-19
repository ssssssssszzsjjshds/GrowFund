import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { loginUser } from "../../redux/slices/authSlice";
import axios from "../../axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password UI state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");

  useEffect(() => {
    if (user) {
      toast.dismiss();
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
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
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

  // --- Forgot Password Handlers ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotStatus("");
    if (!forgotEmail) {
      setForgotStatus("Please enter your email address.");
      return;
    }
    try {
      setForgotStatus("Sending reset link...");
      await axios.post("/api/auth/forgot-password", { email: forgotEmail });
      setForgotStatus(
        "If that email exists, a reset link has been sent. Please check your inbox."
      );
    } catch (err) {
      setForgotStatus("Failed to send reset link. Try again later.");
    }
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
      {!showForgot ? (
        <>
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
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-500 hover:underline"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-2 rounded"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              autoComplete="username"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Send Password Reset Link
            </button>
            <button
              type="button"
              className="text-sm text-gray-500 hover:underline w-full"
              onClick={() => {
                setShowForgot(false);
                setForgotStatus("");
              }}
            >
              Back to Login
            </button>
            {forgotStatus && (
              <div className="text-xs text-gray-600">{forgotStatus}</div>
            )}
          </form>
        </div>
      )}
      {/* Optional: Add a link to reset-password page for dev testing */}
      {/* <Link to="/reset-password/testtoken" className="text-xs text-blue-500 underline">Test Reset Page</Link> */}
    </div>
  );
};

export default Login;
