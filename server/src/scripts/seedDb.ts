import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../db";
import { Meeting } from "../models/meeting";

const SEED_COUNT = 100;
const ONE_HOUR_MS = 60 * 60 * 1000;

const buildMockMeetings = () => {
  const now = Date.now();
  return Array.from({ length: SEED_COUNT }, (_, i) => {
    const startTime = new Date(
      now + Math.floor(Math.random() * ONE_HOUR_MS * 24)
    );
    return {
      title: `Dummy Meeting ${i + 1}`,
      startTime,
      endTime: new Date(startTime.getTime() + ONE_HOUR_MS),
    };
  });
};

const seedDb = async () => {
  await connectDB();

  const existing = await Meeting.countDocuments();
  if (existing > 0) {
    console.log(
      `Meetings collection already contains ${existing} document(s). ` +
        `Run "npm run db:reset" first if you want a clean seed.`
    );
    await mongoose.disconnect();
    return;
  }

  console.log(`Seeding ${SEED_COUNT} mock meetings...`);
  await Meeting.insertMany(buildMockMeetings());
  console.log("Seed complete.");

  await mongoose.disconnect();
};

seedDb().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
