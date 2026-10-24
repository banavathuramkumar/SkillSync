import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root or server directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skillsync",
  JWT_SECRET: process.env.JWT_SECRET || "skillsync_super_secure_jwt_secret_change_in_production_2026",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, "../../uploads"),
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5 MB
};
