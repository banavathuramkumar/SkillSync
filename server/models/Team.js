import mongoose from "mongoose";

const memberSubSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      default: "Member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      maxlength: [120, "Team name cannot exceed 120 characters"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      index: true,
    },
    competitionName: {
      type: String,
      required: [true, "Competition or initiative name is required"],
      trim: true,
      index: true,
    },
    problemStatement: {
      type: String,
      trim: true,
      default: "",
    },
    projectTitle: {
      type: String,
      trim: true,
      default: "",
    },
    requiredSkills: {
      type: [String],
      required: [true, "At least one required skill must be specified"],
      index: true,
    },
    state: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    format: {
      type: String,
      enum: [
        "Online / Virtual",
        "Offline / In-person",
        "Hybrid",
        "Virtual",
        "In-Person",
        "Online",
        "Offline",
        "Offline / On-Campus",
      ],
      default: "Online / Virtual",
    },
    maxMembers: {
      type: Number,
      required: [true, "Maximum team size is required"],
      min: [2, "Team must have at least 2 spots"],
      max: [10, "Team cannot exceed 10 spots"],
      default: 4,
    },
    status: {
      type: String,
      enum: ["Recruiting", "Closed", "Archived"],
      default: "Recruiting",
      index: true,
    },
    deadline: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    members: {
      type: [memberSubSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for remaining member capacity
teamSchema.virtual("openPositions").get(function () {
  return Math.max(0, this.maxMembers - (this.members?.length || 0));
});

// Text index for team search
teamSchema.index({
  name: "text",
  description: "text",
  competitionName: "text",
  projectTitle: "text",
  problemStatement: "text",
});

export const Team = mongoose.model("Team", teamSchema);
