import mongoose from "mongoose";
import Meeting, { IMeeting } from "../models/meeting";
interface IMeetingService {
  onMeetingUpdated?: (meeting: IMeeting) => void;
  onMeetingDeleted?: (meetingId: string) => void;
  createMeeting: (meetingData: IMeeting) => Promise<IMeeting>;
  getMeetingById: (id: string) => Promise<IMeeting | null>;
  updateMeeting: (
    id: string,
    updateData: Partial<IMeeting>
  ) => Promise<IMeeting | null>;
  deleteMeeting: (id: string) => Promise<IMeeting | null>;
  listMeetings: (
    filters: any,
    page: number,
    limit: number
  ) => Promise<mongoose.PaginateResult<IMeeting>>;
}
class MeetingService implements IMeetingService {
  // Optional callback functions
  onMeetingUpdated?: (meeting: IMeeting) => void;
  onMeetingDeleted?: (meetingId: string) => void;

  async createMeeting(meetingData: IMeeting): Promise<IMeeting> {
    const meeting = new Meeting(meetingData);
    return meeting.save();
  }

  async getMeetingById(id: string): Promise<IMeeting | null> {
    return Meeting.findById(id);
  }

  async updateMeeting(
    id: string,
    updateData: Partial<IMeeting>
  ): Promise<IMeeting | null> {
    const updatedMeeting = await Meeting.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // Emit the meeting updated event if the callback is provided
    if (updatedMeeting && this.onMeetingUpdated) {
      this.onMeetingUpdated(updatedMeeting);
    }

    return updatedMeeting;
  }

  async deleteMeeting(id: string): Promise<IMeeting | null> {
    const deletedMeeting = await Meeting.findByIdAndDelete(id);

    // Emit the meeting deleted event if the callback is provided
    if (deletedMeeting && this.onMeetingDeleted) {
      this.onMeetingDeleted(id);
    }

    return deletedMeeting;
  }

  async listMeetings(
    filters: any,
    page: number,
    limit: number
  ): Promise<mongoose.PaginateResult<IMeeting>> {
    return Meeting.paginate(filters, { page, limit });
  }
}

export default new MeetingService();
