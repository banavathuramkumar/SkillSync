import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [4000, "Message cannot exceed 4000 characters"],
    },
    type: {
      type: String,
      enum: ["text", "meeting_invitation", "system"],
      default: "text",
    },
    meeting: {
      roomName: String,
      meetingUrl: String,
      title: String,
      callType: {
        type: String,
        enum: ["video", "group"],
        default: "group",
      },
      status: {
        type: String,
        default: "available",
      },
      meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting",
      },
      startedAt: {
        type: Date,
        default: Date.now,
      },
      startedByName: String,
      startedByAvatar: String,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

export const Message = mongoose.model("Message", messageSchema);
