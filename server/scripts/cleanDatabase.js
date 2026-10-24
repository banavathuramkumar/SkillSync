import mongoose from "mongoose";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Team } from "../models/Team.js";
import { Competition } from "../models/Competition.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { JoinRequest } from "../models/JoinRequest.js";
import { Meeting } from "../models/Meeting.js";

async function clean() {
  console.log("Connecting to MongoDB to remove all fake data...");
  await mongoose.connect(env.MONGODB_URI);

  // 1. Remove all fake users, keeping ONLY the real owner account
  const deletedUsers = await User.deleteMany({
    email: { $ne: "banavathuramkumar@gmail.com" },
  });
  console.log(`Removed ${deletedUsers.deletedCount} fake users.`);

  // 2. Remove all seeded teams
  const deletedTeams = await Team.deleteMany({});
  console.log(`Removed ${deletedTeams.deletedCount} fake teams.`);

  // 3. Remove all seeded competitions
  const deletedCompetitions = await Competition.deleteMany({});
  console.log(`Removed ${deletedCompetitions.deletedCount} fake competitions.`);

  // 4. Remove all conversations, messages, join requests, meetings
  const deletedConvs = await Conversation.deleteMany({});
  const deletedMsgs = await Message.deleteMany({});
  const deletedRequests = await JoinRequest.deleteMany({});
  const deletedMeetings = await Meeting.deleteMany({});

  console.log(`Removed ${deletedConvs.deletedCount} conversations, ${deletedMsgs.deletedCount} messages.`);
  console.log(`Removed ${deletedRequests.deletedCount} requests, ${deletedMeetings.deletedCount} meetings.`);

  // 5. Ensure owner profile is clean with no fake links or avatars
  const owner = await User.findOne({ email: "banavathuramkumar@gmail.com" });
  if (owner) {
    owner.githubUrl = "https://github.com/banavathuramkumar";
    owner.linkedinUrl = "https://www.linkedin.com/in/banavathu-ramkumar/";
    owner.isProfileComplete = true;
    owner.college = "SRM University AP";
    owner.educationLevel = "B.Tech Computer Science and Engineering";
    owner.state = "Andhra Pradesh";
    owner.city = "Amaravati";
    await owner.save();
    console.log("Verified owner profile in DB:", owner.email, owner.name);
  }

  const userCount = await User.countDocuments();
  const teamCount = await Team.countDocuments();
  const compCount = await Competition.countDocuments();
  console.log(`Current DB Counts: Users=${userCount}, Teams=${teamCount}, Competitions=${compCount}`);

  await mongoose.disconnect();
  console.log("Database successfully cleaned of all fake data!");
  process.exit(0);
}

clean().catch((err) => {
  console.error("Cleanup error:", err);
  process.exit(1);
});
