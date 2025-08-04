import mongoose from "mongoose";
import Meeting, { IMeeting, IMeetingCreate } from "../models/meeting";

const listMeetings = async (
  query: any,
): Promise<mongoose.PaginateResult<IMeeting>> => {
  // Extract pagination parameters from query
  const { page = 1, limit = 10, ...filters } = query;
  // Convert page and limit to numbers
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  // Create options object for pagination
  const options = {
    page: pageNum,
    limit: limitNum,
    sort: { startTime: -1 }
  };

  if (filters.title) {
    filters.title = { $regex: new RegExp(filters.title), $options: "i" };
  }

  return Meeting.paginate(filters, options);
};

const createMeeting = async (meeting: IMeetingCreate): Promise<IMeeting> => {
  return Meeting.create(meeting);
}
export default { listMeetings, createMeeting };
