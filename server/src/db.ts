import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI environment variable is not set. Copy .env.example to .env and fill in your MongoDB connection string.",
  );
}

const dbUri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
