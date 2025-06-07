import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

export const connectDb = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Database connected");
};
