import mongoose, { Document } from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IMeeting extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
  roomId: mongoose.Types.ObjectId;
}

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },
  },
  { toJSON: { versionKey: false } }
);

meetingSchema.plugin(paginate);

export const Meeting = mongoose.model<
  IMeeting,
  mongoose.PaginateModel<IMeeting>
>("Meeting", meetingSchema);
