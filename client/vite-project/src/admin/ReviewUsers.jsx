import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminPanelNavbar from "./AdminPanelNavbar";
import {
  fetchUsers,
  banUser,
  unbanUser,
  deleteUser,
} from "../redux/slices/adminUsersSlice";
import { useNavigate } from "react-router";
import { useSocket } from "../SocketContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ReviewUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const { users, loading, error } = useSelector((state) => state.adminUsers);
  const { token, user: currentUser } = useSelector((state) => state.auth);

  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    dispatch(fetchUsers(token));
  }, [dispatch, token]);

  useEffect(() => {
    console.log("Socket:", socket);
    console.log("Current user ID:", currentUser?._id);
  }, [socket, currentUser?._id]);
  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log("Socket connected!", socket.id);
    });
    return () => {
      socket.off("connect");
    };
  }, [socket]);
  useEffect(() => {
    if (!socket || !currentUser?._id) return;

    socket.emit("join", currentUser._id);
    socket.emit("getOnlineUsers");

    const handleOnlineUsers = (userIds) => {
      setOnlineUsers(new Set(userIds));
    };

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [socket, currentUser?._id]);

  const handleBan = (userId) => {
    if (window.confirm("Are you sure you want to ban this user?")) {
      dispatch(banUser({ userId, token }));
    }
  };

  const handleUnban = (userId) => {
    dispatch(unbanUser({ userId, token }));
  };

  const handleDelete = (userId) => {
    if (
      window.confirm(
        "Are you sure you want to DELETE this user? This action cannot be undone."
      ) &&
      window.confirm(
        "Are you ABSOLUTELY sure? This will permanently remove the user."
      )
    ) {
      dispatch(deleteUser({ userId, token }));
    }
  };

  const getProfilePicUrl = (picPath) => {
    if (!picPath) return "/default-profile.png";
    return picPath.startsWith("http") ? picPath : `${API_BASE_URL}${picPath}`;
  };

  return (
    <div>
      <AdminPanelNavbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between border-b py-3"
            >
              <div className="flex items-center gap-4">
                {user.profilePic ? (
                  <img
                    src={getProfilePicUrl(user.profilePic)}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover cursor-pointer border"
                    onClick={() => navigate(`/profile/${user._id}`)}
                    title="Go to profile"
                  />
                ) : (
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-300 text-gray-700 font-bold text-lg cursor-pointer border"
                    onClick={() => navigate(`/profile/${user._id}`)}
                    title="Go to profile"
                  >
                    {user.name ? user.name[0].toUpperCase() : "?"}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                  <div className="text-xs font-semibold">
                    {user.isBanned ? (
                      <span className="text-red-600">Banned</span>
                    ) : onlineUsers.has(user._id) ? (
                      <span className="text-green-700">Active</span>
                    ) : (
                      <span className="text-gray-400">Offline</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {!user.isBanned ? (
                  <button
                    onClick={() => handleBan(user._id)}
                    className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-sm font-bold"
                  >
                    Ban
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnban(user._id)}
                    className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 text-sm font-bold"
                  >
                    Unban
                  </button>
                )}
                <button
                  onClick={() => handleDelete(user._id)}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-red-300 hover:text-white text-sm font-bold"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        {users.length === 0 && !loading && <div>No users found.</div>}
      </div>
    </div>
  );
};

export default ReviewUsers;
