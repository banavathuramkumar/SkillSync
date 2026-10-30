import fs from "fs";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";

async function run() {
  await connectDB();
  const localFile = "./uploads/resumes/resume-6adc705bbbad2e0ef267db3b-1792831767639.pdf";
  if (!fs.existsSync(localFile)) {
    console.error("Local PDF not found!");
    process.exit(1);
  }

  const buf = fs.readFileSync(localFile);
  const b64 = buf.toString("base64");

  const r1 = await User.updateOne(
    { email: "ramkumar_banavathu@srmap.edu.in" },
    { $set: { resumeData: b64, resumeContentType: "application/pdf" } }
  );
  const r2 = await User.updateOne(
    { email: "banavathuramkumar@gmail.com" },
    { $set: { resumeData: b64, resumeContentType: "application/pdf" } }
  );

  console.log("RECOVERY_DONE:", { r1, r2 });
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
