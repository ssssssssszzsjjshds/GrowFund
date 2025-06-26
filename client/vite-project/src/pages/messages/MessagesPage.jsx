import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import ConversationList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";
import {
  setCurrentConversation,
  fetchMessages,
  clearMessages,
} from "../../redux/slices/messageSlice";
import axios from "../../axiosInstance";
import { io } from "socket.io-client";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";

const SOCKET_URL = "http://localhost:5000";

// Utility to normalize user/conversation IDs
const getUserId = (user) => user?._id || user?.userId || user?.id;

const MessagesPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const { currentConversation } = useSelector((state) => state.messages);

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [convError, setConvError] = useState(null);
  // Socket and online users
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch the list of users you have conversations with
  const fetchConversations = useCallback(async () => {
    setLoadingConversations(true);
    setConvError(null);
    try {
      const res = await axios.get("/api/messages/conversations");
      setConversations(res.data || []);
    } catch (err) {
      setConvError(
        err?.response?.data?.msg ||
          err?.message ||
          "Failed to load conversations"
      );
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    return () => dispatch(clearMessages());
  }, [fetchConversations, dispatch]);

  // --- Socket.IO connection and event listeners ---
  useEffect(() => {
    if (!currentUser) return;
    const s = io(SOCKET_URL, { withCredentials: true });
    setSocket(s);

    s.emit("join", currentUser._id);

    s.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // Listen for new messages from other users
    s.on("receiveMessage", (msg) => {
      // If the sender is NOT in our conversations, or for new conversations, refetch
      // (This will also work for updates)
      fetchConversations();
    });

    return () => {
      s.disconnect();
    };
  }, [currentUser, fetchConversations]);

  // When a conversation/user is selected from the sidebar
  const handleSelectConversation = (user) => {
    if (!user) return;
    dispatch(setCurrentConversation(user));
    dispatch(fetchMessages(getUserId(user)));
  };

  // Auto select user if passed from navigation state (e.g., from profile "Message" button)
  const [hasHandledProfileUser, setHasHandledProfileUser] = useState(false);

  useEffect(() => {
    if (
      !hasHandledProfileUser &&
      location.state?.userToMessage &&
      conversations.length > 0 &&
      currentUser
    ) {
      const navId = getUserId(location.state.userToMessage);
      const existingConv = conversations.find((c) => getUserId(c) === navId);
      if (existingConv) {
        handleSelectConversation(existingConv);
      } else {
        handleSelectConversation(location.state.userToMessage);
      }
      setHasHandledProfileUser(true);
      window.history.replaceState({}, document.title);
    }
  }, [
    location.state?.userToMessage,
    conversations.length,
    currentUser,
    hasHandledProfileUser,
  ]);

  if (!currentUser) {
    return (
      <div style={{ padding: 32, color: "#888" }}>
        Please log in to view messages.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "80vh",
        border: "1px solid #eee",
        borderRadius: 8,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* Sidebar: Conversation List */}
      <div
        style={{
          width: 260,
          borderRight: "1px solid #eee",
          background: "#fafbfc",
        }}
      >
        <ConversationList
          conversations={conversations}
          currentConversation={currentConversation}
          onSelect={handleSelectConversation}
          currentUserId={currentUser._id}
          onlineUsers={onlineUsers}
          loading={loadingConversations}
          error={convError}
          socket={socket}
        />
      </div>
      {/* Main Chat Window */}
      <div style={{ flex: 1 }}>
        {currentConversation ? (
          <ChatWindow
            conversationUser={currentConversation}
            currentUser={currentUser}
            onNewMessageSent={fetchConversations}
            socket={socket}
          />
        ) : (
          <div style={{ padding: 32, color: "#888" }}>
            {loadingConversations
              ? "Loading conversations..."
              : convError
              ? convError
              : "Select a conversation to start chatting."}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
