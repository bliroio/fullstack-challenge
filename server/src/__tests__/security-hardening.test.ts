import { describe, it, expect, vi } from "vitest";
import supertest from "supertest";
import express from "express";
import rateLimit from "express-rate-limit";
import { AppError } from "../utils/AppError";

// Mock the meetingService before importing app so the DB is never touched
const mockListMeetings = vi.fn().mockResolvedValue({
  docs: [],
  totalDocs: 0,
  limit: 10,
  page: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
  nextPage: null,
  prevPage: null,
  pagingCounter: 1,
});

vi.mock("../services/meetingService", () => ({
  listMeetings: (...args: unknown[]) => mockListMeetings(...args),
}));

import app from "../app";

const request = supertest(app);

describe("Helmet security headers", () => {
  it("sets X-Content-Type-Options header", async () => {
    const res = await request.get("/api/meetings");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("sets X-Frame-Options header", async () => {
    const res = await request.get("/api/meetings");
    expect(res.headers["x-frame-options"]).toBe("SAMEORIGIN");
  });

  it("sets X-DNS-Prefetch-Control header", async () => {
    const res = await request.get("/api/meetings");
    expect(res.headers["x-dns-prefetch-control"]).toBe("off");
  });
});

describe("Rate limiting", () => {
  it("returns 429 after exceeding the request limit", async () => {
    // Use a separate app with a low limit to avoid sending 100+ requests
    const rateLimitedApp = express();
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 3,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: { message: "Too many requests, please try again later" },
    });
    rateLimitedApp.use("/api/", limiter);
    rateLimitedApp.get("/api/test", (_req, res) => res.json({ ok: true }));

    const agent = supertest(rateLimitedApp);

    // Send requests up to the limit
    for (let i = 0; i < 3; i++) {
      const res = await agent.get("/api/test");
      expect(res.status).toBe(200);
    }

    // Next request should be rate limited
    const res = await agent.get("/api/test");
    expect(res.status).toBe(429);
    expect(res.body.message).toBe("Too many requests, please try again later");
  });
});

describe("Error handling", () => {
  it("does not leak error details on unknown errors", async () => {
    mockListMeetings.mockRejectedValueOnce(new Error("MongoDB connection failed: ECONNREFUSED"));

    const res = await request.get("/api/meetings");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error");
    expect(res.body).not.toHaveProperty("stack");
    expect(res.body.message).not.toContain("MongoDB");
  });

  it("returns correct status and message for AppError (404)", async () => {
    mockListMeetings.mockRejectedValueOnce(new AppError(404, "Meeting not found"));

    const res = await request.get("/api/meetings");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Meeting not found");
  });

  it("returns correct status and message for AppError (400)", async () => {
    mockListMeetings.mockRejectedValueOnce(new AppError(400, "Invalid meeting ID"));

    const res = await request.get("/api/meetings");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid meeting ID");
  });
});
