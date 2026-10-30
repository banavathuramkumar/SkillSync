import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/env.js";
import { connectDB, isDbConnected } from "./config/db.js";
import { initSocket } from "./sockets/socketHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Import Route Handlers
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import joinRequestRoutes from "./routes/joinRequestRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with HTTP Server
initSocket(server);

// Security Headers & Cross-Origin Resource Sharing
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: true, // Allow any local development or production client origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static uploads directory for resumes
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// System & Database Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SkillSync Full-Stack API",
    version: "2.1.0-mongo-resume",
    timestamp: new Date().toISOString(),
    database: isDbConnected() ? "connected" : "disconnected",
    message: isDbConnected()
      ? "MongoDB connected and active"
      : "Running without active DB. Set MONGODB_URI in .env to connect MongoDB Atlas",
  });
});

// Mount API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/requests", joinRequestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/feedback", feedbackRoutes);

// 404 Catch-All for undefined API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint ${req.originalUrl} not found.`,
  });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

// Connect to MongoDB Atlas / Local Database and Start Server (only if run directly)
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  connectDB().finally(() => {
    server.listen(env.PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 SkillSync API & Real-time Server active on port ${env.PORT}`);
      console.log(`🌐 Environment: ${env.NODE_ENV}`);
      console.log(`📡 Socket.IO Real-time Engine initialized`);
      console.log(`🔗 API Base: http://localhost:${env.PORT}/api`);
      console.log(`=======================================================`);
    });
  });
}

// Graceful Process Termination
const handleShutdown = () => {
  console.log("\n[Server] Shutting down SkillSync service gracefully...");
  server.close(() => {
    console.log("[Server] HTTP and Socket servers closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", handleShutdown);
process.on("SIGINT", handleShutdown);

export { app, server };
