import mongoose, { Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  capacity: number;
}

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
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

export const Room = mongoose.model<IRoom>("Room", roomSchema);
