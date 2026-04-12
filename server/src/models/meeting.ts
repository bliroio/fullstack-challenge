import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: { startTime: Date }, value: Date) {
          return value > this.startTime;
        },
        message: "endTime must be after startTime",
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        delete (ret as Record<string, unknown>)._id;
        return ret;
      },
    },
  },
);

meetingSchema.plugin(paginate);

type MeetingDoc = mongoose.InferSchemaType<typeof meetingSchema> &
  mongoose.Document;

export const Meeting = mongoose.model<
  MeetingDoc,
  mongoose.PaginateModel<MeetingDoc>
>("Meeting", meetingSchema);
