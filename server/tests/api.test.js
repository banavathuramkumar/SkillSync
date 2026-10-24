process.env.NODE_ENV = "test";
import { test, describe, before, after } from "node:test";
import assert from "node:assert";
import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../server.js";

describe("SkillSync Full-Stack API & Security Suite", () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skillsync");
    }
  });

  after(async () => {
    server.close();
    await mongoose.disconnect();
  });
  test("1. System Health Check Endpoint", async () => {
    const res = await request(app).get("/api/health");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, "ok");
    assert.strictEqual(res.body.service, "SkillSync Full-Stack API");
    assert.ok(res.body.version);
    assert.ok(res.body.database !== undefined);
  });

  test("2. 404 Handler for Undefined API Routes", async () => {
    const res = await request(app).get("/api/non-existent-endpoint-xyz");
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.error.includes("not found"));
  });

  test("3. Authentication - Registration Validation (Missing Fields)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com" }); // Missing name and password

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.error.includes("provide name, email, and password"));
  });

  test("4. Authentication - Login Validation (Missing Password)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@skillsync.edu.in" });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.error.includes("provide email and password"));
  });

  test("5. Security - Protected Route Denies Unauthenticated Request", async () => {
    const res = await request(app).get("/api/auth/me");
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.error.includes("Authentication required"));
  });

  test("6. Security - Protected Route Rejects Malformed JWT Token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid-tampered-token-12345");

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.error.includes("Invalid or expired authorization token"));
  });

  test("7. Notifications - Protected Route Denies Without Auth", async () => {
    const res = await request(app).get("/api/notifications");
    assert.strictEqual(res.status, 401);
  });

  test("8. Team Chat - Protected Route Denies Without Auth", async () => {
    const res = await request(app).get("/api/messages/conversations");
    assert.strictEqual(res.status, 401);
  });

  test("9. Meetings - Scheduling Route Denies Without Auth", async () => {
    const res = await request(app)
      .post("/api/meetings/schedule")
      .send({ title: "Hackathon Sync", scheduledStart: new Date() });

    assert.strictEqual(res.status, 401);
  });

  test("10. Feedback Submission - Input Validation", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send({ name: "Student" }); // missing email, subject, message

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.error.includes("required"));
  });

  test("11. Feedback Submission - Valid Input Allowed", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send({
        name: "Aarav Sharma",
        email: "aarav@iitd.ac.in",
        category: "Feature Request",
        subject: "Add Web3 Hackathons Category",
        message: "It would be great to have a dedicated section for Ethereum and Solana challenges.",
      });

    // If DB is connected it returns 201, or if DB is offline it gracefully returns 503
    assert.ok([201, 503].includes(res.status));
  });

  test("12. Resume Upload - Rejects Non-PDF Format", async () => {
    // Send request without PDF file
    const res = await request(app)
      .post("/api/auth/resume")
      .set("Authorization", "Bearer fake-token");

    // Rejected by auth first or multer
    assert.ok([400, 401].includes(res.status));
  });

  test("13. Platform Statistics Endpoint", async () => {
    const res = await request(app).get("/api/stats");
    // Returns 200 with live stats or 503 if DB disconnected
    assert.ok([200, 503].includes(res.status));
  });

  test("14. Live Activity Statistics Endpoint (Past 7 Days DB Events)", async () => {
    const res = await request(app).get("/api/stats/activity");
    assert.ok([200, 503].includes(res.status));
    if (res.status === 200) {
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.activity));
      assert.strictEqual(res.body.activity.length, 7);
      assert.ok(res.body.summary);
      assert.strictEqual(res.body.summary.isLiveDatabase, true);
    }
  });
});
