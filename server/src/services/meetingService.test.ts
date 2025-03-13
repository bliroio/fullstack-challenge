import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Meeting from "../models/meeting";
import MeetingService from "../services/meetingService";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Meeting.deleteMany(); // Clear the database before each test
});

describe("MeetingService", () => {
  it("should create a meeting", async () => {
    const meetingData = new Meeting({
      title: "Test Meeting",
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000), // 1 hour later
    });

    const createdMeeting = await MeetingService.createMeeting(meetingData);

    expect(createdMeeting).toBeDefined();
    expect(createdMeeting.title).toBe(meetingData.title);
  });

  it("should get a meeting by ID", async () => {
    const meetingData = new Meeting({
      title: "Test Meeting",
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
    });

    const savedMeeting = await meetingData.save();
    const fetchedMeeting = await MeetingService.getMeetingById(
      savedMeeting._id.toString()
    );

    expect(fetchedMeeting).not.toBeNull();
    expect(fetchedMeeting?.title).toBe(meetingData.title);
  });

  it("should update a meeting", async () => {
    const meetingData = new Meeting({
      title: "Initial Title",
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
    });

    const savedMeeting = await meetingData.save();
    const updatedMeeting = await MeetingService.updateMeeting(
      savedMeeting._id.toString(),
      { title: "Updated Title" }
    );

    expect(updatedMeeting).not.toBeNull();
    expect(updatedMeeting?.title).toBe("Updated Title");
  });

  it("should delete a meeting", async () => {
    const meetingData = new Meeting({
      title: "Test Meeting",
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
    });

    const savedMeeting = await meetingData.save();
    const deletedMeeting = await MeetingService.deleteMeeting(
      savedMeeting._id.toString()
    );

    expect(deletedMeeting).not.toBeNull();
    expect(deletedMeeting?.title).toBe(meetingData.title);

    const foundMeeting = await MeetingService.getMeetingById(
      savedMeeting._id.toString()
    );
    expect(foundMeeting).toBeNull();
  });

  it("should paginate meetings", async () => {
    await Meeting.insertMany([
      { title: "Meeting 1", startTime: new Date(), endTime: new Date() },
      { title: "Meeting 2", startTime: new Date(), endTime: new Date() },
      { title: "Meeting 3", startTime: new Date(), endTime: new Date() },
    ]);

    const result = await MeetingService.listMeetings({}, 1, 2);

    expect(result.docs.length).toBe(2);
    expect(result.totalDocs).toBe(3);
  });
});
