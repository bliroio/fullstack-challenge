import mongoose from 'mongoose';
import Meeting, { IMeeting } from '../models/meeting';

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

const listMeetings = async (
  query: any
): Promise<mongoose.PaginateResult<IMeeting>> => {
  return Meeting.paginate(query);
};

export default {
  createMeeting,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  listMeetings,
};
