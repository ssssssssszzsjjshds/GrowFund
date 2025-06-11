import dotenv from "dotenv";
dotenv.config(); // <-- This MUST be the very first thing
console.log("Google ID at server.js:", process.env.GOOGLE_CLIENT_ID);
import express from "express";
import cors from "cors";
import path from "path";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";

// Import after dotenv.config()
import "./passport.js";

import { connectDb } from "./config/config.js";
import CampaignRouter from "./routes/campaignRouter.js";
import AuthRouter from "./routes/authRouter.js";
import pledgeRoutes from "./routes/pledgeRouter.js";
import commentRoutes from "./routes/commentRouter.js";
import adminRoutes from "./routes/adminRoutes.js";
import saveCampaignRoutes from "./routes/saveCampaign.js";
import balanceRouters from "./routes/balanceRouter.js";

connectDb();

const app = express();

// CORS middleware
console.log("CLIENT_URL is:", process.env.CLIENT_URL);
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
app.use("/", AuthRouter);
app.use("/api/comments", commentRoutes);
app.use("/api/pledges", pledgeRoutes);
app.use("/api/save-campaign", saveCampaignRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", AuthRouter);
app.use("/api/balance", balanceRouters);

app.listen(5000, () => console.log("Server is running on port 5000"));
