import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["team", "direct"],
      default: "team",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],
    lastMessage: {
      text: { type: String, default: "" },
      senderName: { type: String, default: "" },
      timestamp: { type: Date, default: Date.now },
      type: { type: String, default: "text" },
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ participants: 1, updatedAt: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
