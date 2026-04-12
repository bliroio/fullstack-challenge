import { asyncHandler } from "../utils/asyncHandler";
import * as meetingService from "../services/meetingService";

export const listMeetings = asyncHandler(async (req, res) => {
  const meetings = await meetingService.listMeetings(req.query);
  res.json(meetings);
});
