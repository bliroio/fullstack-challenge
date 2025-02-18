import mongoose from 'mongoose';
import Meeting from './models/meeting';

const dbUri = process.env.MONGODB_URI || 'fallback_default_mongodb_uri';

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(dbUri);
    console.log('MongoDB connected');
    console.log('Resetting database...');
    await resetDatabase();

    console.log('Database reset completed');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to reset database
const resetDatabase = async () => {
  // Example: Drop collections or specific documents
  await Meeting.deleteMany({});
};

export default connectDB;
