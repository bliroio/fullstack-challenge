import mongoose from "mongoose";
import { Meeting } from "./models/meeting";

const dbUri = process.env.MONGODB_URI;

if (!dbUri) {
  // Fail fast: falling back to a dummy URI is unsafe for production.
  console.error("MONGODB_URI is required");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log("MongoDB connected...");

    // Seed/reset only when explicitly requested.
    // This prevents accidental data loss in production.
    if (process.env.SEED_DATABASE === "true") {
      await resetDatabase();
      console.log("Database reset completed...");
    } else {
      console.log("Database seeding disabled (set SEED_DATABASE=true to enable).");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const resetDatabase = async () => {
  console.log("Resetting database - PLEASE WAIT...");

  await Meeting.deleteMany({});

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
};

export default connectDB;
