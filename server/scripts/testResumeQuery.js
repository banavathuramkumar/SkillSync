import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";

async function run() {
  await connectDB();
  const safeFilename = "resume-6ae4ada6fb5570531b44e8e8-1793371690168.pdf";
  const u = await User.findOne({
    $or: [
      { resumeUrl: `/api/auth/resume/${safeFilename}` },
      { resumeUrl: new RegExp(safeFilename, "i") },
    ],
  });

  console.log("TEST RESULT:", {
    found: Boolean(u),
    name: u?.name,
    hasResumeData: Boolean(u?.resumeData),
    dataLength: u?.resumeData?.length,
  });
  process.exit(0);
}

run().catch(console.error);
