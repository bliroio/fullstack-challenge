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

export const deleteMeeting = asyncHandler(async (req, res) => {
  await meetingService.deleteMeeting(req.params.id);
  res.status(204).send();
});

export const updateMeeting = asyncHandler(async (req, res) => {
  const meeting = await meetingService.updateMeeting(req.params.id, req.body);
  res.json(meeting);
});
