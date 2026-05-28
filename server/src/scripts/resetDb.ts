import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../db";
import { Meeting } from "../models/meeting";

const resetDb = async () => {
  await connectDB();

  console.log("Resetting database — deleting all meetings...");
  const { deletedCount } = await Meeting.deleteMany({});
  console.log(`Deleted ${deletedCount} meeting(s).`);

  await mongoose.disconnect();
};

resetDb().catch(async (error) => {
  console.error("Reset failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
