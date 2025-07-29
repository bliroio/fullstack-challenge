import mongoose, { Document } from "mongoose";
import paginate from "mongoose-paginate-v2";

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

meetingSchema.plugin(paginate);

const Meeting = mongoose.model<IMeeting, mongoose.PaginateModel<IMeeting>>(
  "Meeting",
  meetingSchema,
);
export default Meeting;
