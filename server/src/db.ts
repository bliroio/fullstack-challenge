import mongoose from "mongoose";
import Meeting from "./models/meeting";

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

// Function to reset database
const resetDatabase = async () => {
  console.log("Resetting database - PLEASE WAIT...");

  // Example: Drop collections or specific documents
  await Meeting.deleteMany({});

  const meetings = [];
  const now = new Date().getTime();
  
  // Sample attendee names
  const attendeeNames = [
    'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'David Brown',
    'Lisa Anderson', 'Chris Taylor', 'Amy Thompson', 'Kevin White', 'Jessica Miller',
    'Ryan Garcia', 'Michelle Lee', 'Brian Clark', 'Ashley Martinez', 'Daniel Rodriguez'
  ];
  
  const meetingTitles = [
    'Weekly Team Standup', 'Product Review Meeting', 'Client Presentation',
    'Budget Planning Session', 'Marketing Strategy Discussion', 'Engineering Sync',
    'Sales Pipeline Review', 'Quarterly Business Review', 'Project Kickoff',
    'Design System Review', 'User Research Findings', 'Sprint Planning'
  ];

  for (let i = 0; i < 100; i++) {
    // Random date between past 30 days and future 30 days
    const randomStartDate = new Date(
      now + Math.floor((Math.random() - 0.5) * 60 * 24 * 60 * 60 * 1000) // ±30 days
    );
    
    // Random meeting duration between 30min and 2 hours
    const duration = (30 + Math.floor(Math.random() * 90)) * 60 * 1000;
    
    // Generate random attendees (2-6 people)
    const numAttendees = 2 + Math.floor(Math.random() * 5);
    const shuffledNames = [...attendeeNames].sort(() => 0.5 - Math.random());
    const attendees = shuffledNames.slice(0, numAttendees).map((name, index) => ({
      id: `user_${i}_${index}`,
      name: name
    }));

    meetings.push({
      title: meetingTitles[Math.floor(Math.random() * meetingTitles.length)],
      startTime: randomStartDate,
      endTime: new Date(randomStartDate.getTime() + duration),
      attendees: attendees,
      userId: 'user_1' // Assuming current user is user_1
    });
  }

  await Meeting.insertMany(meetings);
};

export default connectDB;
