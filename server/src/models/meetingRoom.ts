import mongoose, { Document } from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IMeetingRoom extends Document {
  name: string;
  location: string;
  capacity: number;
  imageUrl: string;
}

const meetingRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

meetingRoomSchema.plugin(paginate);

const MeetingRoom = mongoose.model<
  IMeetingRoom,
  mongoose.PaginateModel<IMeetingRoom>
>("MeetingRoom", meetingRoomSchema);

export default MeetingRoom;
