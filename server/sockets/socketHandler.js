import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Team } from "../models/Team.js";
import { Conversation } from "../models/Conversation.js";

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("Authentication token required for Socket connection."));
      }

      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("name email");

      if (!user) {
        return next(new Error("User not found or session invalid."));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Unauthorized socket handshake."));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    console.log(`[Socket.IO] User connected: ${socket.user.name} (${userId})`);

    // 1. Join user's private notification & alert room
    socket.join(`user:${userId}`);

    // 2. Join a team or conversation room with server-side authorization check
    socket.on("conversation:join", async (conversationId) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        // Check if user is a direct participant
        const isParticipant = conversation.participants.some(
          (p) => p.toString() === userId
        );

        if (isParticipant) {
          socket.join(`conversation:${conversationId}`);
          return;
        }

        // If team chat, check team membership
        if (conversation.team) {
          const team = await Team.findById(conversation.team);
          const isMember =
            team &&
            (team.owner.toString() === userId ||
              team.members.some((m) => m.user.toString() === userId));

          if (isMember) {
            socket.join(`conversation:${conversationId}`);
          }
        }
      } catch (err) {
        console.error("[Socket.IO] Error joining conversation:", err.message);
      }
    });

    // 3. Leave a conversation room
    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] User disconnected: ${socket.user.name} (${userId})`);
    });
  });

  return io;
};

export const getIO = () => io;
