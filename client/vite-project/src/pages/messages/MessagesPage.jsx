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

const SOCKET_URL = "http://localhost:5000"; // or use your env/client url

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
    // connect only once
    const s = io(SOCKET_URL, { withCredentials: true });
    setSocket(s);

    s.emit("join", currentUser._id);

    // Listen for list of online users
    s.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      s.disconnect();
    };
  }, [currentUser]);

  // When a conversation/user is selected from the sidebar
  const handleSelectConversation = (user) => {
    if (!user) return;
    dispatch(setCurrentConversation(user));
    dispatch(fetchMessages(user._id));
  };

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
