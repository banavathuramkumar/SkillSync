import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    callType: {
      type: String,
      enum: ["video", "group"],
      default: "group",
    },
    provider: {
      type: String,
      default: "jitsi",
    },
    roomName: {
      type: String,
      required: true,
    },
    meetingUrl: {
      type: String,
      required: true,
    },
    scheduledStart: {
      type: Date,
      required: [true, "Meeting date and time is required"],
      index: true,
    },
    scheduledEnd: {
      type: Date,
    },
    durationMinutes: {
      type: Number,
      default: 45,
      min: [5, "Duration must be at least 5 minutes"],
      max: [480, "Duration cannot exceed 8 hours"],
    },
    status: {
      type: String,
      enum: ["scheduled", "available", "in_progress", "completed", "cancelled"],
      default: "scheduled",
      index: true,
    },
    cancelledReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

meetingSchema.index({ team: 1, scheduledStart: 1 });
meetingSchema.index({ organizer: 1, scheduledStart: 1 });

export const Meeting = mongoose.model("Meeting", meetingSchema);
