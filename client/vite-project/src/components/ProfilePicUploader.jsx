import React, { useRef, useState } from "react";
import axios from "../axiosInstance";

export default function ProfilePicUploader({ currentPic, onUpload }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const inputRef = useRef();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setStatus("Please select an image.");
    setStatus("Uploading...");
    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      const res = await axios.post("/api/user/profile-picture", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpload && onUpload(res.data.profilePic);
      setFile(null);
      inputRef.current.value = "";
      setStatus("Profile picture updated!");
    } catch {
      setStatus("Failed to upload image.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <img
        src={currentPic ? currentPic : "/default-profile.png"}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover mb-2 border "
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={inputRef}
        className="mb-2"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-1 rounded text-sm"
      >
        Change Profile Picture
      </button>
      {status && <div className="text-xs text-gray-500 mt-1">{status}</div>}
    </form>
  );
}
