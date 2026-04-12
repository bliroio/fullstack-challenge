import mongoose from "mongoose";
import dotenv from "dotenv";
import { Meeting } from "./models/meeting";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI environment variable is not set. Copy .env.example to .env and fill in your MongoDB connection string.",
  );
}

const dbUri = process.env.MONGODB_URI;

const seed = async () => {
  // Safety guard 1: refuse if NODE_ENV is production
  const env = process.env.NODE_ENV || "development";
  if (env === "production") {
    console.error(
      "ERROR: Seeding is not allowed when NODE_ENV=production."
    );
    process.exit(1);
  }

  // Safety guard 2: seeding is opt-in — requires explicit SEED_DB=true
  if (process.env.SEED_DB !== "true") {
    console.error(
      "ERROR: Seeding is disabled by default. Set SEED_DB=true to seed."
    );
    process.exit(1);
  }

  const clearFlag = process.argv.includes("--clear");

  try {
    await mongoose.connect(dbUri);
    console.log(`MongoDB connected for seeding (env: ${env})...`);

    if (clearFlag) {
      console.log("--clear flag detected: wiping existing meetings...");
      await Meeting.deleteMany({});
      console.log("All meetings deleted.");
    }

    const existingCount = await Meeting.countDocuments();
    if (existingCount > 0 && !clearFlag) {
      console.log(
        `Database already has ${existingCount} meetings. Use --clear to wipe and reseed.`
      );
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log("Seeding 100 dummy meetings...");

    const meetings = [];
    const now = new Date().getTime();
    const oneHour = 60 * 60 * 1000;

    for (let i = 0; i < 100; i++) {
      const randomStartDate = new Date(
        now + Math.floor(Math.random() * oneHour * 24)
      );

      meetings.push({
        title: `Dummy Meeting ${i + 1}`,
        startTime: randomStartDate,
        endTime: new Date(randomStartDate.getTime() + oneHour),
      });
    }

    await Meeting.insertMany(meetings);
    console.log("Seeding complete: 100 meetings inserted.");

    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

seed();
