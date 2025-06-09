import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { connectDb } from "./config/config.js";
import CampaignRouter from "./routes/campaignRouter.js";
import AuthRouter from "./routes/authRouter.js";
import pledgeRoutes from "./routes/pledgeRouter.js";
import commentRoutes from "./routes/commentRouter.js";
import adminRoutes from "./routes/adminRoutes.js";
import saveCampaignRoutes from "./routes/saveCampaign.js"; // <-- Add this line
import cookieParser from "cookie-parser";

dotenv.config();
connectDb();

const app = express();

// ✅ CORS middleware — must be first
console.log("CLIENT_URL is:", process.env.CLIENT_URL);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (uploads)
app.use("/uploads", express.static(path.resolve("uploads")));

// ✅ API Routes
app.use("/", CampaignRouter); // /api/campaigns
app.use("/", AuthRouter); // /api/auth/login & register
app.use("/api/comments", commentRoutes);
app.use("/api/pledges", pledgeRoutes);
app.use("/api/save-campaign", saveCampaignRoutes); // <-- Add this line
app.use("/api/admin", adminRoutes);

// ✅ Start server
app.listen(5000, () => console.log("Server is running on port 5000"));
