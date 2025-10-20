import mongoose from "mongoose";
import { Meeting } from "./models/meeting";

const dbUri = process.env.MONGODB_URI || "fallback_default_mongodb_uri";

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log("MongoDB connected...");

    await resetDatabase();

    console.log("Database reset completed...");
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
