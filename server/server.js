import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import "./passport.js";

import { connectDb } from "./config/config.js";
import CampaignRouter from "./routes/campaignRouter.js";
import AuthRouter from "./routes/authRouter.js";
import pledgeRoutes from "./routes/pledgeRouter.js";
import commentRoutes from "./routes/commentRouter.js";
import adminRoutes from "./routes/adminRoutes.js";
import saveCampaignRoutes from "./routes/saveCampaign.js";
import balanceRouters from "./routes/balanceRouter.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Connect to database
connectDb();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_super_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/", CampaignRouter);

app.use("/api/comments", commentRoutes);
app.use("/api/pledges", pledgeRoutes);
app.use("/api/save-campaign", saveCampaignRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", AuthRouter);
app.use("/api/balance", balanceRouters);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ----------- SOCKET.IO SETUP -----------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

const onlineUsers = new Map(); // userId -> socket.id
const typingUsers = new Map(); // roomId (conversation) -> Set of userIds

// Utility: consistent room id for 1-to-1 chat (alphabetical order)
function getRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join("-");
}

io.on("connection", (socket) => {
  // User comes online
  socket.on("join", (userId) => {
    socket.userId = userId;
    onlineUsers.set(userId, socket.id);
    socket.join(userId); // Personal room for notifications
    io.emit("onlineUsers", Array.from(onlineUsers.keys())); // broadcast new online list
  });

  // Join a conversation room for 1-on-1 chat
  socket.on("joinConversation", (roomId) => {
    socket.join(roomId);
  });

  // Typing indicator
  socket.on("typing", ({ roomId, userId }) => {
    if (!typingUsers.has(roomId)) typingUsers.set(roomId, new Set());
    typingUsers.get(roomId).add(userId);
    socket.to(roomId).emit("userTyping", { roomId, userId, typing: true });
  });

  socket.on("stopTyping", ({ roomId, userId }) => {
    if (typingUsers.has(roomId)) typingUsers.get(roomId).delete(userId);
    socket.to(roomId).emit("userTyping", { roomId, userId, typing: false });
  });

  // Send message (to conversation room)
  socket.on("sendMessage", ({ roomId, message }) => {
    io.to(roomId).emit("receiveMessage", message);
  });

  // Read receipts
  socket.on("messageRead", ({ roomId, userId, messageId }) => {
    // Notify all users in the room except the reader
    socket.to(roomId).emit("messageRead", { roomId, userId, messageId });
  });

  // User disconnects
  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    }
    // Optionally, clean up typingUsers for this socket if needed
  });
});

server.listen(5000, () =>
  console.log("Server is running on port 5000 (with sockets)")
);
