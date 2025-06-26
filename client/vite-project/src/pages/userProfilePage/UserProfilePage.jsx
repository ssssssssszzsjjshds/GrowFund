import React, { useEffect, useState } from "react";
import axios from "../../axiosInstance";
import { useParams, useNavigate } from "react-router";
import { FaInstagram, FaFacebook, FaLinkedin, FaGlobe } from "react-icons/fa";
import { useSelector } from "react-redux";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function UserProfilePage() {
  const { id } = useParams(); // get user id from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = useSelector((state) => state.auth.user); // logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");
    axios
      .get(`/api/user/${id}`)
      .then((res) => setProfile(res.data))
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, [id]);

  const socials = [
    {
      icon: <FaInstagram />,
      url: profile?.instagram,
      label: "Instagram",
      color: "text-pink-500",
    },
    {
      icon: <FaFacebook />,
      url: profile?.facebook,
      label: "Facebook",
      color: "text-blue-600",
    },
    {
      icon: <FaLinkedin />,
      url: profile?.linkedin,
      label: "LinkedIn",
      color: "text-blue-700",
    },
    {
      icon: <FaGlobe />,
      url: profile?.portfolio,
      label: "Portfolio",
      color: "text-green-700",
    },
  ];

  // Handler for "Message" button
  const handleMessage = () => {
    console.log("Navigating to messages with:", profile);
    navigate("/messages", {
      state: {
        userToMessage: {
          _id: profile._id,
          name: profile.name,
          avatar: profile.avatar,
        },
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-[#635bff] text-center">
        {loading
          ? "Loading..."
          : error
          ? "Error"
          : `${profile?.name}'s Profile`}
      </h1>
      {error && <div className="text-center text-red-500 mb-6">{error}</div>}
      {!loading && profile && (
        <>
          <div className="text-center text-gray-500 text-sm mb-6">
            Joined at:{" "}
            {profile?.createdAt && !isNaN(new Date(profile.createdAt))
              ? new Date(profile.createdAt).toLocaleDateString()
              : "Unknown"}
          </div>
          {/* Social Links */}
          <div className="flex gap-4 justify-center mb-4">
            {socials.map(
              (s, idx) =>
                s.url &&
                s.url.trim() && (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`text-2xl hover:scale-110 transition-transform ${s.color}`}
                  >
                    {s.icon}
                  </a>
                )
            )}
          </div>

          {/* Message Button */}
          {currentUser && profile._id !== currentUser._id && (
            <div className="flex justify-center mb-8">
              <button
                className="bg-[#635bff] hover:bg-[#5146ff] text-white font-semibold px-6 py-2 rounded shadow transition"
                onClick={handleMessage}
              >
                Message
              </button>
            </div>
          )}

          {/* Created Projects */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {profile.name}'s Created Projects
            </h2>
            {profile.createdProjects?.length === 0 ? (
              <div className="text-gray-500 text-center">No projects yet.</div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {profile.createdProjects?.map((proj) => (
                  <li
                    key={proj._id}
                    className="bg-[#f6f9fc] rounded-lg p-4 border flex flex-col items-center"
                  >
                    {proj.image && (
                      <img
                        src={
                          proj.image.startsWith("http")
                            ? proj.image
                            : `${API_BASE_URL}${proj.image}`
                        }
                        alt={proj.title}
                        className="w-full h-32 object-cover rounded mb-3 border"
                      />
                    )}
                    <div className="font-semibold text-lg text-center text-[#635bff]">
                      {proj.title}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
