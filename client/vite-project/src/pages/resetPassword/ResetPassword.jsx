import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import axios from "../../axiosInstance"; // <-- adjust if your axios instance is elsewhere

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!password || !confirmPassword) {
      setStatus("Please fill both fields.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }
    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      setStatus("Password reset successful! Redirecting to login...");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      setStatus(
        e.response?.data?.msg || "Failed to reset password. Your link may have expired."
      );
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full border p-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            disabled={success}
          >
            {success ? "Success!" : "Update Password"}
          </button>
        </form>
        {status && (
          <div
            className={`mt-4 text-center text-sm ${
              success ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}