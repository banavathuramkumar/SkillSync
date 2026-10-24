import mongoose from "mongoose";
import { env } from "./env.js";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      console.warn("[Database] MongoDB connection lost. Retrying in background...");
    });

    mongoose.connection.on("reconnected", () => {
      isConnected = true;
      console.log("[Database] MongoDB reconnected successfully.");
    });
  } catch (error) {
    isConnected = false;
    console.error("[Database] Failed to connect to MongoDB:", error.message);
    console.warn("[Database] Running without persistent DB until MONGODB_URI is provided. Database-dependent API calls will return 503.");
  }
};

export const isDbConnected = () => isConnected;

export const checkDbConnection = (req, res, next) => {
  if (!isConnected && mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: "Database service unavailable. Please configure MONGODB_URI (e.g. MongoDB Atlas connection string) in your .env file.",
    });
  }
  next();
};
