import mongoose, { Document } from 'mongoose';

export interface IMeeting extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
}

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

const Meeting = mongoose.model<IMeeting>('Meeting', meetingSchema);
export default Meeting;
