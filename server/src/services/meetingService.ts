import mongoose from "mongoose";
import Meeting, { IMeeting } from "../models/meeting";

interface ICreateMeeting {
  title: string;
  startTime: Date;
  endTime: Date;
}

const listMeetings = async (
  query: any
): Promise<mongoose.PaginateResult<IMeeting>> => {
  return Meeting.paginate(query);
};

const createMeeting = async (data: ICreateMeeting): Promise<IMeeting> => {
  const meeting = new Meeting(data);
  return meeting.save();
};

export default { listMeetings, createMeeting };
