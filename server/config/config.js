import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

export const connectDb = async () => {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected");
};