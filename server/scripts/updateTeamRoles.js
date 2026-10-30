import { connectDB } from "../config/db.js";
import { Team } from "../models/Team.js";

async function run() {
  await connectDB();
  const res = await Team.updateOne(
    { name: "CodeVision" },
    {
      $set: {
        openRoles: [
          "Full-Stack Developer",
          "Machine Learning and Data Analyst",
          "Research and Problem-Solving Member",
          "Presentation and Documentation Lead",
        ],
      },
    }
  );
  console.log("UPDATE_SUCCESS:", res);
  process.exit(0);
}

run().catch((err) => {
  console.error("UPDATE_ERROR:", err);
  process.exit(1);
});
