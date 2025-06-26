import React, { useState } from "react";
import axios from "../../../axiosInstance";

const getUserId = (user) => user._id || user.userId || user.id;

const ConversationList = ({
  conversations,
  currentConversation,
  onSelect,
  currentUserId,
  loading,
  error,
  onlineUsers = [],
  socket,
}) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await axios.get(
        `/api/users/search?q=${encodeURIComponent(value)}`
      );
      // Filter out users already in conversations
      const existingIds = conversations.map(getUserId);
      setResults(res.data.filter((u) => !existingIds.includes(getUserId(u))));
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Optional: highlight online users at the top (sort)
  const sortedConversations = [...conversations].sort((a, b) => {
    const aOnline = onlineUsers.includes(getUserId(a));
    const bOnline = onlineUsers.includes(getUserId(b));
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;
    return 0;
  });

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Search bar */}
      <div
        style={{
          padding: 8,
          background: "#fff",
          borderBottom: "1px solid #eee",
        }}
      >
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Message someone..."
          style={{
            width: "100%",
            padding: "6px 12px",
            borderRadius: 14,
            border: "1px solid #ccc",
            fontSize: 15,
          }}
        />
      </div>
      {/* Show search results if searching */}
      {search && results.length > 0 && (
        <div style={{ background: "#fafafa", borderBottom: "1px solid #eee" }}>
          {searching ? (
            <div style={{ padding: 14, color: "#888" }}>Searching…</div>
          ) : (
            results.map((user) => (
              <div
                key={getUserId(user)}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #f6f6f6",
                }}
                onClick={() => {
                  onSelect(user);
                  setSearch("");
                  setResults([]);
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      marginRight: 10,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "#bbb",
                      marginRight: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {user.name[0]?.toUpperCase()}
                  </div>
                )}
                <span>{user.name}</span>
              </div>
            ))
          )}
        </div>
      )}
      {/* List of conversations */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {error && <div style={{ color: "red", padding: 12 }}>{error}</div>}
        {/* Keep conversations visible during loading, subtle indicator instead of erasing */}
        {sortedConversations.length === 0 && loading ? (
          <div style={{ padding: 12, color: "#888" }}>Loading...</div>
        ) : (
          <>
            {loading && sortedConversations.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 52,
                  right: 20,
                  color: "#888",
                  fontSize: 14,
                  zIndex: 1,
                  background: "#fafbfc",
                  borderRadius: 6,
                  padding: "3px 10px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                Updating...
              </div>
            )}
            {sortedConversations.map((conv) => {
              const isOnline = onlineUsers.includes(getUserId(conv));
              return (
                <div
                  key={getUserId(conv)}
                  onClick={() => onSelect(conv)}
                  style={{
                    padding: 12,
                    background:
                      currentConversation &&
                      getUserId(currentConversation) === getUserId(conv)
                        ? "#e6f0ff"
                        : "#fafbfc",
                    cursor: "pointer",
                    borderBottom: "1px solid #f1f1f1",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {conv.avatar ? (
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        marginRight: 10,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#bbb",
                        marginRight: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {conv.name[0]?.toUpperCase()}
                    </div>
                  )}
                  <span>{conv.name}</span>
                  {/* Online status dot */}
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: isOnline ? "#4caf50" : "#bbb",
                      display: "inline-block",
                      marginLeft: 10,
                      border: "1.5px solid #fff",
                      boxShadow: isOnline ? "0 0 3px #4caf50" : undefined,
                    }}
                    title={isOnline ? "Online" : "Offline"}
                  />
                </div>
              );
            })}
            {/* Show a message if no conversations at all and not loading */}
            {!loading && sortedConversations.length === 0 && (
              <div style={{ padding: 14, color: "#888" }}>
                You have no conversations yet.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
