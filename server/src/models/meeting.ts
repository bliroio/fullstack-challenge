import mongoose, { Document } from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IBookedBy {
  name: string;
  email: string;
}

export interface IMeeting extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
  roomId: mongoose.Types.ObjectId;
  bookedBy: IBookedBy;
}

export interface IMeetingCreate {
  title: string;
  startTime: Date;
  endTime: Date;
  roomId: mongoose.Types.ObjectId | string;
  bookedBy: IBookedBy;
}

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MeetingRoom",
    required: true,
  },
  bookedBy: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
});

meetingSchema.index({ roomId: 1, startTime: 1, endTime: 1 });

meetingSchema.plugin(paginate);

const Meeting = mongoose.model<IMeeting, mongoose.PaginateModel<IMeeting>>(
  "Meeting",
  meetingSchema,
);
export default Meeting;
