import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import fc from "fast-check";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";

const request = supertest(app);

beforeAll(async () => {
  const testDbUrl =
    process.env.TEST_MONGODB_URI || "mongodb://localhost:27017/meetings-test";
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

describe("GET /api/meetings — query validation", () => {
  it("returns 200 with default page=1 and limit=10 when no params provided", async () => {
    const res = await request.get("/api/meetings").expect(200);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(10);
  });

  it("returns 400 when page is negative", async () => {
    const res = await request.get("/api/meetings?page=-1").expect(400);
    expect(res.body.message).toBe("Validation failed");
    expect(res.body.errors).toHaveProperty("page");
  });

  it("returns 400 when page is zero", async () => {
    const res = await request.get("/api/meetings?page=0").expect(400);
    expect(res.body.message).toBe("Validation failed");
    expect(res.body.errors).toHaveProperty("page");
  });

  it("returns 400 when limit exceeds 100", async () => {
    const res = await request.get("/api/meetings?limit=999999").expect(400);
    expect(res.body.message).toBe("Validation failed");
    expect(res.body.errors).toHaveProperty("limit");
  });

  it("returns 400 when page is non-numeric", async () => {
    await request.get("/api/meetings?page=abc").expect(400);
  });

  it("returns 400 when title exceeds 200 characters", async () => {
    const longTitle = "a".repeat(201);
    const res = await request
      .get(`/api/meetings?title=${longTitle}`)
      .expect(400);
    expect(res.body.message).toBe("Validation failed");
    expect(res.body.errors).toHaveProperty("title");
  });

  it("returns 200 for valid page and limit params", async () => {
    const res = await request
      .get("/api/meetings?page=2&limit=5")
      .expect(200);
    expect(res.body.page).toBe(2);
    expect(res.body.limit).toBe(5);
  });

  // Property-based: any accepted response always has page >= 1
  it("property: page in response is always >= 1 for any accepted request", () => {
    return fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 1000 }),
        async (page) => {
          const res = await request
            .get(`/api/meetings?page=${page}`)
            .expect(200);
          expect(res.body.page).toBeGreaterThanOrEqual(1);
        }
      ),
      { numRuns: 10 }
    );
  });

  // Property-based: any accepted response always has limit <= 100
  it("property: limit in response is always <= 100 for any accepted request", () => {
    return fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }),
        async (limit) => {
          const res = await request
            .get(`/api/meetings?limit=${limit}`)
            .expect(200);
          expect(res.body.limit).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 10 }
    );
  });

  // Property-based: requests with out-of-bounds values always rejected
  it("property: page < 1 is always rejected with 400", () => {
    return fc.assert(
      fc.asyncProperty(
        fc.integer({ min: -10000, max: 0 }),
        async (page) => {
          await request.get(`/api/meetings?page=${page}`).expect(400);
        }
      ),
      { numRuns: 10 }
    );
  });

  // Property-based: limit > 100 is always rejected
  it("property: limit > 100 is always rejected with 400", () => {
    return fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 101, max: 10000 }),
        async (limit) => {
          await request.get(`/api/meetings?limit=${limit}`).expect(400);
        }
      ),
      { numRuns: 10 }
    );
  });

  it("filters results by title when title param is provided", async () => {
    // Create a meeting with a specific title first
    await request
      .post("/api/meetings")
      .send({
        title: "Standup Meeting",
        startTime: "2025-01-15T09:00:00Z",
        endTime: "2025-01-15T09:30:00Z",
      })
      .expect(201);

    await request
      .post("/api/meetings")
      .send({
        title: "Design Review",
        startTime: "2025-01-15T10:00:00Z",
        endTime: "2025-01-15T10:30:00Z",
      })
      .expect(201);

    const res = await request
      .get("/api/meetings?title=standup")
      .expect(200);

    expect(res.body.docs).toHaveLength(1);
    expect(res.body.docs[0].title).toBe("Standup Meeting");
  });
});
