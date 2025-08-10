import mongoose from "mongoose";
import Meeting, { IMeeting } from "../models/meeting";
import { Meeting as MeetingDTO } from "../utils/meeting.utils.schema";

const listMeetings = async (
  query: any,
): Promise<mongoose.PaginateResult<IMeeting>> => {
  return Meeting.paginate(query);
};

const createMeeting = async (data: MeetingDTO) => {
  return Meeting.create(data);
}

export default { createMeeting, listMeetings };
