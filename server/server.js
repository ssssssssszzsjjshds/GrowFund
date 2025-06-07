import express from "express";
import { connectDb } from "./config/config.js";
import CampaignRouter from "./routes/campaignRouter.js";
import AuthRouter from "./routes/authRouter.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import pledgeRoutes from "./routes/pledge.js";
import commentRoutes from "./routes/comment.js";
dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.resolve("uploads"))); // Important!

// API Routes
app.use("/", CampaignRouter); // /api/campaigns
app.use("/", AuthRouter); // /api/auth/login & register
app.use("/api/comments", commentRoutes);
app.use("/api/pledges", pledgeRoutes);
app.listen(5000, () => console.log("Server is running on port 5000"));
