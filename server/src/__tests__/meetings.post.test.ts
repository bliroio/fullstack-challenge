import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import fc from "fast-check";
import mongoose from "mongoose";
import supertest from "supertest";
import { createMeetingSchema } from "shared/schemas/meeting";
import app from "../app";

const request = supertest(app);

// Valid meeting arbitrary (manual)
const validCreateInput = fc.record({
  title: fc.string({ minLength: 1, maxLength: 200 }),
  startTime: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') }).map(d => d.toISOString()),
  endTime: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') }).map(d => d.toISOString()),
}).filter(m => new Date(m.startTime) < new Date(m.endTime));

beforeAll(async () => {
  const testDbUrl = process.env.TEST_MONGODB_URI || "mongodb://localhost:27017/meetings-test";
  await mongoose.connect(testDbUrl);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  // Clean up meetings between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("POST /api/meetings", () => {
  it("returns 201 with id for any valid createMeetingSchema input", () => {
    return fc.assert(
      fc.asyncProperty(validCreateInput, async (input) => {
        const res = await request
          .post("/api/meetings")
          .send(input)
          .expect(201);

        expect(res.body).toHaveProperty("id");
        expect(res.body.title).toBe(input.title);
      }),
      { numRuns: 20 } // Fewer runs since these hit the DB
    );
  });

  it("returns 400 when title is missing", async () => {
    const res = await request
      .post("/api/meetings")
      .send({
        startTime: "2025-01-15T09:00:00Z",
        endTime: "2025-01-15T09:30:00Z",
      })
      .expect(400);

    expect(res.body.message).toBe("Validation failed");
    expect(res.body.errors).toHaveProperty("title");
  });

  it("returns 400 when endTime is before startTime", async () => {
    const res = await request
      .post("/api/meetings")
      .send({
        title: "Bad Meeting",
        startTime: "2025-01-15T10:00:00Z",
        endTime: "2025-01-15T09:00:00Z",
      })
      .expect(400);

    expect(res.body.message).toBe("Validation failed");
    expect(res.body.errors).toHaveProperty("endTime");
  });

  it("returns 400 for invalid datetime format", async () => {
    const res = await request
      .post("/api/meetings")
      .send({
        title: "Bad Meeting",
        startTime: "not-a-date",
        endTime: "2025-01-15T09:30:00Z",
      })
      .expect(400);

    expect(res.body.message).toBe("Validation failed");
  });
});

// Keep createMeetingSchema import used (avoids unused import lint warning)
void createMeetingSchema;
