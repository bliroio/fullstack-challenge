import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../db";
import { Meeting } from "../models/meeting";
import { Room } from "../models/room";

const resetDb = async () => {
  await connectDB();

  console.log("Resetting database — deleting all meetings and rooms...");
  const meetingResult = await Meeting.deleteMany({});
  const roomResult = await Room.deleteMany({});
  console.log(
    `Deleted ${meetingResult.deletedCount} meeting(s) and ${roomResult.deletedCount} room(s).`
  );

  await mongoose.disconnect();
};

resetDb().catch(async (error) => {
  console.error("Reset failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
