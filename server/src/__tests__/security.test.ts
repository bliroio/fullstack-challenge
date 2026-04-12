import { describe, it, expect, vi } from "vitest";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";

const request = supertest(app);

describe("CORS", () => {
  it("OPTIONS with correct origin returns Access-Control-Allow-Origin header", async () => {
    const res = await request
      .options("/api/meetings")
      .set("Origin", "http://localhost:3001")
      .set("Access-Control-Request-Method", "GET");

    expect(res.headers["access-control-allow-origin"]).toBe(
      "http://localhost:3001"
    );
  });

  it("OPTIONS with wrong origin does not return CORS header", async () => {
    const res = await request
      .options("/api/meetings")
      .set("Origin", "http://evil-site.com")
      .set("Access-Control-Request-Method", "GET");

    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("OPTIONS with custom FRONTEND_URL origin returns CORS header", async () => {
    vi.stubEnv("FRONTEND_URL", "http://myapp.example.com");
    vi.resetModules();
    // Clear mongoose models to allow re-registration on fresh import
    (mongoose.connection as unknown as { models: Record<string, unknown> }).models = {};
    Object.keys(mongoose.models).forEach((key) => delete mongoose.models[key]);
    const { default: customApp } = await import("../app");
    const res = await supertest(customApp)
      .options("/api/meetings")
      .set("Origin", "http://myapp.example.com")
      .set("Access-Control-Request-Method", "GET");

    expect(res.headers["access-control-allow-origin"]).toBe(
      "http://myapp.example.com"
    );
    vi.unstubAllEnvs();
  });
});

describe("Body size limit", () => {
  it("POST with body > 1mb returns 413", async () => {
    const largeBody = {
      title: "A".repeat(2_000_000),
      startTime: "2025-01-15T09:00:00Z",
      endTime: "2025-01-15T09:30:00Z",
    };

    const res = await request
      .post("/api/meetings")
      .set("Content-Type", "application/json")
      .send(largeBody);

    expect(res.status).toBe(413);
  });

  it("POST with body under 1mb is not rejected with 413", async () => {
    const normalBody = {
      title: "Team standup",
      startTime: "2025-01-15T09:00:00Z",
      endTime: "2025-01-15T09:30:00Z",
    };

    // POST to a non-existent route to avoid DB dependency — body parser
    // still runs, so a 413 would fire here if the limit were exceeded
    const res = await request
      .post("/api/nonexistent")
      .set("Content-Type", "application/json")
      .send(normalBody);

    expect(res.status).not.toBe(413);
  });
});
