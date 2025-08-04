import mongoose from "mongoose";
import Meeting, { IMeeting, IMeetingCreate } from "../models/meeting";

const listMeetings = async (
  query: any,
): Promise<mongoose.PaginateResult<IMeeting>> => {
  return Meeting.paginate(query);
};

const createMeeting = async (meeting: IMeetingCreate): Promise<IMeeting> => {
  return Meeting.create(meeting);
}
export default { listMeetings, createMeeting };
