import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../db";
import { Meeting } from "../models/meeting";
import { Room } from "../models/room";

const MOCK_ROOMS = [
  { name: "Aurora", capacity: 4 },
  { name: "Borealis", capacity: 6 },
  { name: "Cascade", capacity: 8 },
  { name: "Delta", capacity: 10 },
  { name: "Eclipse", capacity: 12 },
];

const SEED_MEETING_COUNT = 100;
const ONE_HOUR_MS = 60 * 60 * 1000;

const buildMockMeetings = (roomIds: mongoose.Types.ObjectId[]) => {
  const now = Date.now();
  return Array.from({ length: SEED_MEETING_COUNT }, (_, i) => {
    const startTime = new Date(
      now + Math.floor(Math.random() * ONE_HOUR_MS * 24)
    );
    return {
      title: `Dummy Meeting ${i + 1}`,
      startTime,
      endTime: new Date(startTime.getTime() + ONE_HOUR_MS),
      roomId: roomIds[Math.floor(Math.random() * roomIds.length)],
    };
  });
};

const seedDb = async () => {
  await connectDB();

  const existingMeetings = await Meeting.countDocuments();
  const existingRooms = await Room.countDocuments();

  if (existingMeetings > 0 || existingRooms > 0) {
    console.log(
      `Database is not empty (rooms: ${existingRooms}, meetings: ${existingMeetings}). ` +
        `Run "npm run db:reset" first if you want a clean seed.`
    );
    await mongoose.disconnect();
    return;
  }

  console.log(`Seeding ${MOCK_ROOMS.length} mock rooms...`);
  const rooms = await Room.insertMany(MOCK_ROOMS);
  const roomIds = rooms.map((r) => r._id as mongoose.Types.ObjectId);

  console.log(`Seeding ${SEED_MEETING_COUNT} mock meetings...`);
  await Meeting.insertMany(buildMockMeetings(roomIds));
  console.log("Seed complete.");

  await mongoose.disconnect();
};

seedDb().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
