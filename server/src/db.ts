import mongoose from "mongoose";
import Meeting from "./models/meeting";
import MeetingRoom from "./models/meetingRoom";

const dbUri = process.env.MONGODB_URI || "fallback_default_mongodb_uri";

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log("MongoDB connected...");

    // Optional: Clear existing data and insert dummy data
    await resetDatabase();

    console.log("Database reset completed...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const ROOMS = [
  {
    name: "Sunrise",
    location: "Building A, 1st Floor",
    capacity: 4,
    imageUrl: "/room-1.jpg",
  },
  {
    name: "Horizon",
    location: "Building A, 2nd Floor",
    capacity: 8,
    imageUrl: "/room-2.jpg",
  },
  {
    name: "Summit",
    location: "Building B, 1st Floor",
    capacity: 12,
    imageUrl: "/room-3.jpg",
  },
  {
    name: "Focus Pod",
    location: "Building A, Ground Floor",
    capacity: 2,
    imageUrl: "/room-4.jpg",
  },
  {
    name: "Innovation Lab",
    location: "Building B, 2nd Floor",
    capacity: 20,
    imageUrl: "/room-5.jpg",
  },
  {
    name: "The Loft",
    location: "Building C, 3rd Floor",
    capacity: 6,
    imageUrl: "/room-6.jpg",
  },
];

const NAMES = [
  "Alice Johnson",
  "Bob Smith",
  "Carol Williams",
  "David Brown",
  "Eve Davis",
  "Frank Miller",
  "Grace Wilson",
  "Henry Moore",
];

// Function to reset database
const resetDatabase = async () => {
  console.log("Resetting database - PLEASE WAIT...");

  await Meeting.deleteMany({});
  await MeetingRoom.deleteMany({});

  // Seed rooms
  const rooms = await MeetingRoom.insertMany(ROOMS);

  // Seed meetings with 15-minute aligned times during business hours
  const meetings = [];
  const DURATIONS = [15, 30, 45, 60, 90, 120]; // minutes
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 50; i++) {
    // Random day within the next 7 days
    const dayOffset = Math.floor(Math.random() * 7);
    const day = new Date(today.getTime() + dayOffset * 24 * 60 * 60 * 1000);

    // Random 15-min aligned time between 08:00 and 18:00
    const slotIndex = Math.floor(Math.random() * 40); // 40 slots from 8:00 to 18:00
    const startHour = 8 + Math.floor(slotIndex / 4);
    const startMin = (slotIndex % 4) * 15;

    const startTime = new Date(day);
    startTime.setHours(startHour, startMin, 0, 0);

    const duration = DURATIONS[Math.floor(Math.random() * DURATIONS.length)];
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    // Don't exceed business hours
    if (endTime.getHours() > 20 || (endTime.getHours() === 20 && endTime.getMinutes() > 0)) {
      continue;
    }

    const room = rooms[Math.floor(Math.random() * rooms.length)];
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];

    meetings.push({
      title: `Meeting ${i + 1}`,
      startTime,
      endTime,
      roomId: room._id,
      bookedBy: {
        name,
        email: `${name.toLowerCase().replace(" ", ".")}@youwork.com`,
      },
    });
  }

  await Meeting.insertMany(meetings);
};

export default connectDB;
