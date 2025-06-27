import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { logoutUser } from "../../../redux/slices/authSlice";
import SearchBar from "../../../components/SearchBar";
import { categories } from "../../../../../../shared/categories";
import logo from "../../../assets/logo.png"; // Replace with your logo path
import CreatedCampaignsMenuList from "../../../components/CreatedCampaignsMenuList";

import { useSocket } from "../../../SocketContext";

// Set your API base URL here or use an environment variable
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Nav = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { createdCampaigns = [] } = user || {};
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    if (socket && user?._id) {
      console.log("Emitting userLogout for", user._id);
      socket.emit("userLogout", String(user._id));
    } else {
      console.log("No socket or user id");
    }
    dispatch(logoutUser());
    navigate("/");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return "?";
  };

  // Helper to get the profile picture URL
  const getProfilePicUrl = (picPath) => {
    if (!picPath) return "/default-profile.png";
    return picPath.startsWith("http") ? picPath : `${API_BASE_URL}${picPath}`;
  };

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo & Admin Link Section */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-10 object-contain" />
          </Link>
          {/* Conditionally render Admin Panel link */}
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="ml-3 px-3 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold text-sm hover:bg-yellow-200 transition"
            >
              Admin Panel
            </Link>
          )}
        </div>
        {/* Search Bar */}
        <div className="flex-1 flex justify-center px-8">
          <div className="w-full max-w-lg">
            <SearchBar />
          </div>
        </div>
        {/* Profile/User Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Avatar Button */}
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-blue-600 hover:ring-2 ring-blue-400 transition overflow-hidden"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Open profile menu"
              >
                {user.profilePic ? (
                  <img
                    src={getProfilePicUrl(user.profilePic)}
                    alt="Profile"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                ) : (
                  getInitial()
                )}
              </button>
              {/* Dropdown Menu */}
              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute top-16 right-6 z-20 w-[460px] bg-white shadow-xl rounded-lg p-6 border border-gray-100"
                >
                  <div className="flex gap-8">
                    <div>
                      <div className="text-xs font-bold mb-2 text-gray-700">
                        YOUR ACCOUNT
                      </div>
                      <ul className="space-y-2">
                        {/* Balance section START */}
                        <div className="mb-3">
                          <span className="text-gray-600 text-xs">
                            Balance:
                          </span>
                          <span className="ml-2 font-bold text-blue-600">
                            $
                            {user.balance != null
                              ? user.balance.toFixed(2)
                              : "0.00"}
                          </span>
                          <Link
                            to="/mock-payment"
                            className="ml-4 text-xs underline text-green-600 hover:text-green-800"
                            onClick={() => setMenuOpen(false)}
                          >
                            Add Funds
                          </Link>
                        </div>
                        {/* Balance section END */}
                        <li>
                          <Link
                            to="/saved-campaigns"
                            className="hover:underline"
                            onClick={() => setMenuOpen(false)}
                          >
                            Saved projects
                          </Link>
                        </li>

                        <li>
                          <Link
                            to={`/profile/${user._id}`}
                            className="hover:underline"
                            onClick={() => setMenuOpen(false)}
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/settings/profile"
                            className="hover:underline"
                            onClick={() => setMenuOpen(false)}
                          >
                            Settings
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/messages"
                            className="hover:underline"
                            onClick={() => setMenuOpen(false)}
                          >
                            Messages
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/activity"
                            className="hover:underline"
                            onClick={() => setMenuOpen(false)}
                          >
                            Activity
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-2">
                        {/* List created campaigns */}
                        <div>
                          <div className="text-xs font-bold mb-2 text-gray-700">
                            CREATED PROJECTS
                          </div>
                          <ul className="space-y-2">
                            <li>
                              <button
                                className="hover:underline flex items-center"
                                onClick={() => {
                                  setMenuOpen(false);
                                  navigate("/create-campaign");
                                }}
                              >
                                <span className="bg-gray-100 rounded px-2 py-1 mr-2 text-lg text-blue-600 font-bold">
                                  +
                                </span>
                                New
                              </button>
                            </li>
                          </ul>
                          <CreatedCampaignsMenuList
                            onItemClick={(id) => {
                              setMenuOpen(false);
                              navigate(`/campaigns/${id}`);
                            }}
                          />
                        </div>
                      </ul>
                    </div>
                  </div>
                  <hr className="my-5" />
                  <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* Categories Bar */}
      <div className="bg-gray-50 py-2 px-6 border-b border-gray-200 mx-auto flex justify-center">
        <div className="flex gap-3 mt-2 flex-wrap max-w-7xl mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/category/${encodeURIComponent(cat)}`}
              className="text-xs underline hover:text-yellow-500 "
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
