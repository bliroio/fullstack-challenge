import mongoose from "mongoose";
import Meeting, { IMeeting } from "../models/meeting";

const listMeetings = async (
  query: any,
): Promise<mongoose.PaginateResult<IMeeting>> => {
  return Meeting.paginate(query);
};

const createMeeting = async (meeting: IMeeting): Promise<IMeeting> => {
  return Meeting.create(meeting);
}
export default { listMeetings, createMeeting };
