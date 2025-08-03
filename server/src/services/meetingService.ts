import { PaginateResult } from "mongoose";
import Meeting, { IMeeting } from "../models/meeting";

const listMeetings = async (query: any): Promise<PaginateResult<IMeeting>> => {
  const options = {
    limit: parseInt(query.limit) || 100, // Default to 100 meetings per call
    page: parseInt(query.page) || 1,
    sort: { startTime: 1 }, // Sort by start time ascending
  };

  // Remove limit and page from query to avoid passing them as filter criteria
  const { limit, page, ...filterQuery } = query;

  return Meeting.paginate(filterQuery, options);
};

const createMeeting = async (meetingData: IMeeting): Promise<IMeeting> => {
  const meeting = new Meeting(meetingData);
  return meeting.save();
};

export default { listMeetings, createMeeting };
