import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, fetchMessages } from "../../../redux/slices/messageSlice";

const ChatWindow = ({
  conversationUser,
  currentUser,
  onNewMessageSent,
  socket,
}) => {
  const dispatch = useDispatch();
  const { messages, loading, sending, sendError } = useSelector(
    (state) => state.messages
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Typing indicator state
  const [isTyping, setIsTyping] = useState(false);
  const [showRead, setShowRead] = useState({});

  const typingTimeoutRef = useRef(null);
  const [hasAnnouncedTyping, setHasAnnouncedTyping] = useState(false);

  // Use _id or userId for the receiver, fallback logic
  const receiverId = conversationUser?._id || conversationUser?.userId;

  const getRoomId = () => {
    return [currentUser._id, receiverId].sort().join("-");
  };
  const roomId = getRoomId();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (conversationUser && currentUser) {
      dispatch(fetchMessages(receiverId));
    }
  }, [conversationUser, currentUser, dispatch, receiverId]);

  useEffect(() => {
    if (!socket || !currentUser || !conversationUser) return;

    socket.emit("joinConversation", roomId);

    const handleUserTyping = ({ roomId: incomingRoomId, userId, typing }) => {
      if (incomingRoomId === roomId && userId === receiverId) {
        setIsTyping(typing);
      }
    };
    socket.on("userTyping", handleUserTyping);

    const handleMessageRead = ({
      roomId: incomingRoomId,
      userId,
      messageId,
    }) => {
      if (incomingRoomId === roomId && userId === receiverId) {
        setShowRead((sr) => ({ ...sr, [messageId]: true }));
      }
    };
    socket.on("messageRead", handleMessageRead);

    const handleReceiveMessage = (msg) => {
      if (
        (msg.sender === receiverId && msg.receiver === currentUser._id) ||
        (msg.sender === currentUser._id && msg.receiver === receiverId)
      ) {
        dispatch(fetchMessages(receiverId));
      }
    };
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("userTyping", handleUserTyping);
      socket.off("messageRead", handleMessageRead);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [
    socket,
    roomId,
    receiverId,
    currentUser?._id,
    dispatch,
    conversationUser,
  ]);

  useEffect(() => {
    if (!socket || !messages || !messages.length) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === receiverId) {
      socket.emit("messageRead", {
        roomId,
        userId: currentUser._id,
        messageId: lastMsg._id,
      });
    }
  }, [socket, messages, receiverId, currentUser?._id, roomId]);

  useEffect(() => {
    if (!socket || !conversationUser || !currentUser) return;

    if (input) {
      if (!hasAnnouncedTyping) {
        socket.emit("typing", { roomId, userId: currentUser._id });
        setHasAnnouncedTyping(true);
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { roomId, userId: currentUser._id });
        setHasAnnouncedTyping(false);
      }, 1500);
    } else {
      if (hasAnnouncedTyping) {
        socket.emit("stopTyping", { roomId, userId: currentUser._id });
        setHasAnnouncedTyping(false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [
    input,
    socket,
    roomId,
    receiverId,
    currentUser?._id,
    hasAnnouncedTyping,
    conversationUser,
  ]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Debug log to help catch any undefined value
    console.log("Sending to receiver:", receiverId, "Content:", input.trim());

    if (!receiverId) {
      alert("No recipient selected. Please try again.");
      return;
    }

    try {
      const result = await dispatch(
        sendMessage({
          receiver: receiverId,
          content: input.trim(),
        })
      ).unwrap();
      setInput("");
      if (onNewMessageSent) onNewMessageSent();

      if (socket) {
        socket.emit("sendMessage", {
          roomId,
          message: {
            ...result,
          },
        });
      }
    } catch (err) {
      // Error is handled by slice/sendError
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #eee",
          padding: "1rem",
          background: "#fafbfc",
          display: "flex",
          alignItems: "center",
        }}
      >
        {conversationUser.avatar ? (
          <img
            src={conversationUser.avatar}
            alt={conversationUser.name}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              marginRight: 14,
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#bbb",
              marginRight: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {conversationUser.name[0]?.toUpperCase()}
          </div>
        )}
        <span style={{ fontSize: 18, fontWeight: 500 }}>
          {conversationUser.name}
        </span>
      </div>
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          background: "#f7f7fa",
          position: "relative",
        }}
      >
        {/* Subtle loading indicator in the corner if loading and messages already exist */}
        {loading && messages.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 20,
              color: "#888",
              fontSize: 14,
              zIndex: 1,
            }}
          >
            Updating...
          </div>
        )}

        {/* Only show full loading if no messages */}
        {!loading && messages.length === 0 ? (
          <div style={{ color: "#888", textAlign: "center" }}>
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender === currentUser._id;
            const isLastOwn =
              isOwn && messages[messages.length - 1]._id === msg._id;
            return (
              <div
                key={msg._id}
                style={{
                  display: "flex",
                  justifyContent: isOwn ? "flex-end" : "flex-start",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    background: isOwn ? "#1976d2" : "#fff",
                    color: isOwn ? "#fff" : "#222",
                    borderRadius: 18,
                    padding: "0.5rem 1rem",
                    maxWidth: "70%",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    position: "relative",
                  }}
                >
                  <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: isOwn ? "#bbdefb" : "#888",
                      textAlign: "right",
                      marginTop: 3,
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {isLastOwn && showRead[msg._id] && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 2,
                        right: 8,
                        fontSize: 12,
                        color: "#4caf50",
                        fontWeight: 500,
                      }}
                    >
                      ✓✓ Read
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        {isTyping && (
          <div style={{ color: "#888", fontSize: 14, marginLeft: 10 }}>
            {conversationUser.name} is typing…
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form
        onSubmit={handleSend}
        style={{
          borderTop: "1px solid #eee",
          padding: "0.75rem",
          background: "#fafbfc",
          display: "flex",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Type your message…"
          disabled={sending || !receiverId}
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: 20,
            padding: "0.5rem 1rem",
            outline: "none",
            fontSize: 16,
          }}
        />
        <button
          type="submit"
          disabled={sending || !input.trim() || !receiverId}
          style={{
            marginLeft: 8,
            padding: "0.5rem 1.25rem",
            border: "none",
            borderRadius: 20,
            background: "#1976d2",
            color: "#fff",
            fontWeight: 500,
            fontSize: 16,
            cursor:
              sending || !input.trim() || !receiverId
                ? "not-allowed"
                : "pointer",
          }}
        >
          {sending ? "…" : "Send"}
        </button>
      </form>
      {sendError && (
        <div style={{ color: "red", padding: "0.5rem 1rem" }}>{sendError}</div>
      )}
      {!receiverId && (
        <div style={{ color: "red", padding: "0.5rem 1rem" }}>
          No recipient selected. Please try again.
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
