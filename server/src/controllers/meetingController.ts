import { asyncHandler } from "../utils/asyncHandler";
import * as meetingService from "../services/meetingService";

export const listMeetings = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meetings = await meetingService.listMeetings(req.query as any);
  res.json(meetings);
});

export const createMeeting = asyncHandler(async (req, res) => {
  const meeting = await meetingService.createMeeting(req.body);
  res.status(201).json(meeting);
});
