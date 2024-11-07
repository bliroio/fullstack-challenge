import mongoose from "mongoose";
import Meeting, { IMeeting } from '../models/meeting';
import { PaginationParameters } from "mongoose-paginate-v2";

const createMeeting = async (meetingData: IMeeting): Promise<IMeeting> => {
  const meeting = new Meeting(meetingData);
  return meeting.save();
};

const getMeetingById = async (id: string): Promise<IMeeting | null> => {
  return Meeting.findById(id);
};

const updateMeeting = async (
  id: string,
  updateData: Partial<IMeeting>
): Promise<IMeeting | null> => {
  return Meeting.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteMeeting = async (id: string): Promise<IMeeting | null> => {
  return Meeting.findByIdAndDelete(id);
};

const listMeetings = async (req: any): Promise<mongoose.PaginateResult<IMeeting>> => {
  return Meeting.paginate(...new PaginationParameters(req).get());
};

export default {
  createMeeting,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  listMeetings,
};
