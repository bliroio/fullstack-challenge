import mongoose, { Document } from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IMeeting extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
}

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

meetingSchema.plugin(paginate);

export const Meeting = mongoose.model<
  IMeeting,
  mongoose.PaginateModel<IMeeting>
>("Meeting", meetingSchema);
