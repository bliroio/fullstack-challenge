import mongoose, { Document } from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IMeeting extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
  attendees: { id: string; name: string }[];
  userId: string;
}

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  attendees: [{
    id: { type: String, required: true },
    name: { type: String, required: true }
  }],
  userId: { type: String, required: true }
});

meetingSchema.plugin(paginate);

const Meeting = mongoose.model<IMeeting, mongoose.PaginateModel<IMeeting>>(
  "Meeting",
  meetingSchema,
);
export default Meeting;
