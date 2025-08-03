import { PaginateResult } from "mongoose";
import Meeting, { IMeeting } from "../models/meeting";

const listMeetings = async (query: any): Promise<PaginateResult<IMeeting>> => {
  return Meeting.paginate(query);
};

const createMeeting = async (meetingData: IMeeting): Promise<IMeeting> => {
  const meeting = new Meeting(meetingData);
  return meeting.save();
};

export default { listMeetings, createMeeting };
