import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Team } from "../models/Team.js";
import { Competition } from "../models/Competition.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";

const seedDatabase = async () => {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Refusing to run seed script in production environment!");
    process.exit(1);
  }

  console.log("Connecting to database for development seeding...");
  await mongoose.connect(env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  // Clear existing development collections
  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Competition.deleteMany({}),
    Conversation.deleteMany({}),
    Message.deleteMany({}),
  ]);
  console.log("Cleared old development data.");

  // 1. Seed Real Student Users
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const users = await User.create([
    {
      name: "Ramkumar Banavathu",
      email: "banavathuramkumar@gmail.com",
      password: hashedPassword,
      college: "SRM University AP",
      educationLevel: "B.Tech Computer Science and Engineering",
      state: "Andhra Pradesh",
      city: "Amaravati",
      skills: ["React", "Node.js", "JavaScript", "Tailwind CSS", "MongoDB", "Full Stack Systems"],
      bio: "Developer & Founder of SkillSync. Team Member & Owner of Corporate Connect. Passionate about connecting students and budding developers.",
      githubUrl: "https://github.com/banavathuramkumar",
      linkedinUrl: "https://www.linkedin.com/in/banavathu-ramkumar/",
      leetcodeUrl: "https://leetcode.com/banavathuramkumar",
      isProfileComplete: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
    {
      name: "Aarav Sharma",
      email: "aarav.sharma@iitd.ac.in",
      password: hashedPassword,
      college: "IIT Delhi",
      educationLevel: "B.Tech Computer Science",
      state: "Delhi",
      city: "New Delhi",
      skills: ["PyTorch", "Computer Vision", "FastAPI", "Docker", "Python"],
      bio: "Computer Vision researcher and Kaggle Master. Exploring multi-spectral satellite imagery for agricultural yield prediction.",
      githubUrl: "https://github.com/aarav-cv",
      linkedinUrl: "https://linkedin.com/in/aarav-sharma-iitd",
      leetcodeUrl: "https://leetcode.com/aarav_codes",
      isProfileComplete: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    {
      name: "Ananya Iyer",
      email: "ananya.iyer@bits-pilani.ac.in",
      password: hashedPassword,
      college: "BITS Pilani",
      educationLevel: "B.E. Electronics & Instrumentation",
      state: "Rajasthan",
      city: "Pilani",
      skills: ["UI/UX Design", "Figma", "React", "Tailwind CSS", "Design Systems"],
      bio: "Product designer passionate about clean interfaces and student developer accessibility.",
      githubUrl: "https://github.com/ananya-design",
      linkedinUrl: "https://linkedin.com/in/ananya-iyer",
      leetcodeUrl: "https://leetcode.com/ananya_ui",
      isProfileComplete: true,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
    {
      name: "Rohan Verma",
      email: "rohan.v@nitk.edu.in",
      password: hashedPassword,
      college: "NIT Surathkal",
      educationLevel: "B.Tech Information Technology",
      state: "Karnataka",
      city: "Mangalore",
      skills: ["Solidity", "Smart Contracts", "Web3.js", "Node.js", "Go"],
      bio: "Blockchain engineer developing decentralized micro-lending protocols.",
      githubUrl: "https://github.com/rohan-web3",
      linkedinUrl: "https://linkedin.com/in/rohan-verma-nitk",
      leetcodeUrl: "https://leetcode.com/rohan_v",
      isProfileComplete: true,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
  ]);
  console.log(`Seeded ${users.length} users.`);

  // 2. Seed Real Competitions
  const competitions = await Competition.create([
    {
      title: "Smart India Hackathon (SIH) 2026",
      organizer: "Ministry of Education & AICTE",
      category: "Smart India Hackathon",
      mode: "Hybrid",
      prizePool: "₹1,00,000 per Problem Statement",
      registrationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      tags: ["AICTE", "Government of India", "Hardware & Software"],
      websiteUrl: "https://sih.gov.in",
      description: "World's biggest open innovation model for university students across India to solve real-world problems.",
      eligibility: "Regular college students studying in recognized institutions.",
      teamSizeLabel: "6 Members (Min 1 Female)",
      maxTeamSize: 6,
    },
    {
      title: "India AI Impact Summit 2026",
      organizer: "MeitY & NASSCOM",
      category: "AI / ML Challenges",
      mode: "Online / Virtual",
      prizePool: "₹15,00,000 Total Pool",
      registrationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      tags: ["Healthcare AI", "Agriculture", "LLMs"],
      websiteUrl: "https://indiaai.gov.in",
      description: "Developing scalable artificial intelligence prototypes to solve regional challenges in agriculture and public healthcare.",
      eligibility: "Open to developers and students across India.",
      teamSizeLabel: "2-4 Members",
      maxTeamSize: 4,
    },
    {
      title: "ETHIndia 2026",
      organizer: "Devfolio & Ethereum Foundation",
      category: "Web / Mobile Dev",
      mode: "Offline / On-Campus",
      prizePool: "$100,000+ in Bounties",
      registrationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      tags: ["Web3", "Ethereum", "ZK-Rollups"],
      websiteUrl: "https://ethindia.co",
      description: "Asia's largest Ethereum hackathon uniting builders from across the globe in Bengaluru.",
      eligibility: "Open to student developers and Web3 builders.",
      teamSizeLabel: "2-4 Members",
      maxTeamSize: 4,
    },
  ]);
  console.log(`Seeded ${competitions.length} competitions.`);

  // 3. Seed Realistic Teams
  const team1 = await Team.create({
    name: "AgriVision AI",
    description: "Building an automated crop disease detection and yield forecast model using satellite imagery and drone computer vision for SIH.",
    category: "Smart India Hackathon",
    competitionName: "Smart India Hackathon (SIH) 2026",
    problemStatement: "SIH-1429: AI-Driven Precision Agriculture & Pest Detection",
    projectTitle: "AgriVision Edge AI System",
    requiredSkills: ["Computer Vision", "PyTorch", "React", "FastAPI"],
    state: "Andhra Pradesh",
    city: "Amaravati",
    format: "Hybrid",
    maxMembers: 6,
    status: "Recruiting",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    owner: users[0]._id,
    members: [
      { user: users[0]._id, role: "Team Lead & Full Stack", joinedAt: new Date(), isOwner: true },
      { user: users[1]._id, role: "AI / ML Engineer", joinedAt: new Date(), isOwner: false },
    ],
  });

  const team2 = await Team.create({
    name: "FinGuard Protocol",
    description: "Decentralized micro-insurance protocol using smart contracts to protect gig workers against wage loss during extreme weather.",
    category: "Startup Competitions",
    competitionName: "ETHIndia 2026",
    problemStatement: "Parametric Climate Micro-Insurance for Gig Workers",
    projectTitle: "FinGuard Smart Contracts",
    requiredSkills: ["Solidity", "React", "Web3.js", "Node.js"],
    state: "Karnataka",
    city: "Bengaluru",
    format: "Virtual",
    maxMembers: 4,
    status: "Recruiting",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    owner: users[3]._id,
    members: [
      { user: users[3]._id, role: "Blockchain Architect", joinedAt: new Date(), isOwner: true },
    ],
  });
  console.log("Seeded sample teams.");

  // 4. Seed Team Conversations & Initial Messages
  const conv1 = await Conversation.create({
    team: team1._id,
    name: team1.name,
    type: "team",
    participants: [users[0]._id, users[1]._id],
    lastMessage: {
      text: "Dataset preprocessing notebook pushed to GitHub repo.",
      senderName: users[1].name,
      timestamp: new Date(),
      type: "text",
    },
  });

  await Message.create({
    conversation: conv1._id,
    sender: users[0]._id,
    senderName: users[0].name,
    senderAvatar: users[0].avatar,
    text: "Welcome to AgriVision AI! Let's build a standout prototype for SIH 2026.",
    type: "text",
  });

  await Message.create({
    conversation: conv1._id,
    sender: users[1]._id,
    senderName: users[1].name,
    senderAvatar: users[1].avatar,
    text: "Dataset preprocessing notebook pushed to GitHub repo. I will initiate a group sync to discuss architecture.",
    type: "text",
  });

  console.log("Seeding complete successfully! Run the frontend and backend to start building.");
  await mongoose.disconnect();
  process.exit(0);
};

seedDatabase().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
