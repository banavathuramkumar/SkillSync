import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Competition title is required"],
      trim: true,
      index: true,
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    mode: {
      type: String,
      enum: ["Online / Virtual", "Offline / On-Campus", "Hybrid"],
      default: "Online / Virtual",
    },
    prizePool: {
      type: String,
      default: "TBD",
    },
    registrationDeadline: {
      type: Date,
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    eligibility: {
      type: String,
      default: "Open to all enrolled university & college students across India",
    },
    teamSizeLabel: {
      type: String,
      default: "2-4 Members",
    },
    maxTeamSize: {
      type: Number,
      default: 4,
    },
  },
  {
    timestamps: true,
  }
);

competitionSchema.index({
  title: "text",
  organizer: "text",
  category: "text",
  tags: "text",
});

export const Competition = mongoose.model("Competition", competitionSchema);
