import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../db";
import { createRoom } from "../services/roomService";
import { ValidationError } from "../services/meetingService";

const printUsage = () => {
  console.error(`Usage: npm run db:create-room -- <name> <capacity>

Examples:
  npm run db:create-room -- "Aurora" 4
  npm run db:create-room -- "Big conference room" 20`);
};

const run = async () => {
  const [name, capacityArg] = process.argv.slice(2);

  if (!name || !capacityArg) {
    printUsage();
    process.exit(1);
  }

  await connectDB();

  try {
    const room = await createRoom({ name, capacity: capacityArg });
    console.log(`Created room "${room.name}" (capacity ${room.capacity}) with id ${room._id}`);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(`Validation error: ${error.message}`);
      process.exitCode = 1;
    } else {
      throw error;
    }
  } finally {
    await mongoose.disconnect();
  }
};

run().catch(async (error) => {
  console.error("Create-room failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
