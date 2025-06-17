import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance";

// If you use redux, you can get the user from there instead of fetching manually
const UserProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    emailVerified: false,
    instagram: "",
    facebook: "",
    linkedin: "",
    portfolio: "",
    provider: "", // <-- add provider field to hold auth type
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  // Fetch user profile on mount, including provider
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("/api/users/me", { withCredentials: true });
        setProfile({
          name: res.data.name || "",
          email: res.data.email || "",
          emailVerified: res.data.emailVerified || false,
          instagram: res.data.instagram || "",
          facebook: res.data.facebook || "",
          linkedin: res.data.linkedin || "",
          portfolio: res.data.portfolio || "",
          provider: res.data.provider || "", // assumes backend sends provider: "local" | "google" | "facebook"
        });
      } catch (e) {
        setStatus("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      await axios.put(
        "/api/users/me",
        {
          instagram: profile.instagram,
          facebook: profile.facebook,
          linkedin: profile.linkedin,
          portfolio: profile.portfolio,
        },
        { withCredentials: true }
      );
      setStatus("Profile updated!");
    } catch (e) {
      setStatus("Failed to update profile.");
    }
  };

  const handleVerifyEmail = async () => {
    setEmailStatus("Sending verification email...");
    try {
      await axios.post(
        "/api/auth/send-verification",
        { email: profile.email },
        { withCredentials: true }
      );
      setEmailStatus("Verification email sent! Check your inbox.");
    } catch (e) {
      setEmailStatus("Failed to send verification email.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // Determine if password change should be shown:
  // Hide for "google" or "facebook" provider
  const canChangePassword = !profile.provider || profile.provider === "local";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>

      {/* Email Section */}
      <section className="mb-6">
        <h2 className="font-medium mb-2">Email</h2>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-800">{profile.email}</span>
          <span
            className={`text-xs font-semibold ${
              profile.emailVerified ? "text-green-600" : "text-red-600"
            }`}
          >
            {profile.emailVerified ? "Verified" : "Not Verified"}
          </span>
          {!profile.emailVerified && (
            <button
              className="ml-3 text-blue-600 text-xs underline"
              onClick={handleVerifyEmail}
              type="button"
            >
              Verify Email
            </button>
          )}
        </div>
        {emailStatus && (
          <div className="text-xs text-gray-500">{emailStatus}</div>
        )}
      </section>

      {/* Social Media Links */}
      <section className="mb-6">
        <h2 className="font-medium mb-2">Social Media Links</h2>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Instagram</label>
            <input
              type="url"
              name="instagram"
              placeholder="https://instagram.com/yourprofile"
              value={profile.instagram}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Facebook</label>
            <input
              type="url"
              name="facebook"
              placeholder="https://facebook.com/yourprofile"
              value={profile.facebook}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              placeholder="https://linkedin.com/in/yourprofile"
              value={profile.linkedin}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Portfolio</label>
            <input
              type="url"
              name="portfolio"
              placeholder="https://yourportfolio.com"
              value={profile.portfolio}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Save Changes
          </button>
          {status && <div className="text-xs text-gray-500">{status}</div>}
        </form>
      </section>

      {/* Change Password Section */}
      <section>
        <h2 className="font-medium mb-2">Change Password</h2>
        {canChangePassword ? (
          <ChangePasswordForm />
        ) : (
          <div className="italic text-gray-500">
            Password change is not available for accounts logged in with Google
            or Facebook.
          </div>
        )}
      </section>
    </div>
  );
};

function ChangePasswordForm() {
  const [form, setForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [status, setStatus] = useState("");
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new !== form.confirm) {
      setStatus("New passwords do not match.");
      return;
    }
    setStatus("Updating...");
    try {
      await axios.post(
        "/api/auth/change-password",
        {
          currentPassword: form.current,
          newPassword: form.new,
        },
        { withCredentials: true }
      );
      setStatus("Password updated!");
      setForm({ current: "", new: "", confirm: "" });
    } catch {
      setStatus("Failed to update password.");
    }
  };

  return (
    <form className="space-y-2 max-w-sm" onSubmit={handleSubmit}>
      <input
        name="current"
        type="password"
        placeholder="Current password"
        value={form.current}
        onChange={handleChange}
        className="border rounded p-2 w-full"
        required
      />
      <input
        name="new"
        type="password"
        placeholder="New password"
        value={form.new}
        onChange={handleChange}
        className="border rounded p-2 w-full"
        required
      />
      <input
        name="confirm"
        type="password"
        placeholder="Confirm new password"
        value={form.confirm}
        onChange={handleChange}
        className="border rounded p-2 w-full"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Password
      </button>
      {status && <div className="text-xs text-gray-500">{status}</div>}
    </form>
  );
}

export default UserProfileSettings;
