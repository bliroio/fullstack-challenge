import mongoose from "mongoose";
import Meeting, { IMeeting } from "../models/meeting";

type MeetingStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

interface MeetingWithStatus extends IMeeting {
  status: MeetingStatus;
}

const calculateMeetingStatus = (startTime: Date, endTime: Date): MeetingStatus => {
  const now = new Date();
  
  if (now < startTime) {
    return 'upcoming';
  } else if (now >= startTime && now <= endTime) {
    return 'in_progress';
  } else {
    return 'completed';
  }
};

const listMeetings = async (
  query: any,
): Promise<mongoose.PaginateResult<MeetingWithStatus>> => {
  // Extract options if they exist
  const { options, ...filter } = query;
  
  // Call paginate with filter and options as separate parameters
  const result = await Meeting.paginate(filter, options || {});
  
  // Add calculated status to each meeting
  const meetingsWithStatus = result.docs.map(meeting => ({
    ...meeting.toObject(),
    status: calculateMeetingStatus(meeting.startTime, meeting.endTime)
  }));
  
  return {
    ...result,
    docs: meetingsWithStatus
  };
};

export default { listMeetings };
export type { MeetingWithStatus };
