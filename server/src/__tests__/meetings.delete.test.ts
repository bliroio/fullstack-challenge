import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";
import { Meeting } from "../models/meeting";

const request = supertest(app);

beforeAll(async () => {
  const testDbUrl = process.env.TEST_MONGODB_URI || "mongodb://localhost:27017/meetings-test";
  await mongoose.connect(testDbUrl);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("DELETE /api/meetings/:id", () => {
  it("returns 204 when deleting an existing meeting", async () => {
    const meeting = await Meeting.create({
      title: "Meeting to delete",
      startTime: new Date("2025-01-15T09:00:00Z"),
      endTime: new Date("2025-01-15T09:30:00Z"),
    });

    await request
      .delete(`/api/meetings/${meeting._id.toString()}`)
      .expect(204);

    const found = await Meeting.findById(meeting._id);
    expect(found).toBeNull();
  });

  it("returns 404 when deleting a non-existent meeting", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    const res = await request
      .delete(`/api/meetings/${nonExistentId}`)
      .expect(404);

    expect(res.body.message).toBe("Meeting not found");
  });

  it("returns 400 for an invalid ID format", async () => {
    const res = await request
      .delete("/api/meetings/not-a-valid-id")
      .expect(400);

    expect(res.body.message).toBe("Invalid meeting ID");
  });
});
