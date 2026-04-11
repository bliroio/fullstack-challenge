import { MeetingRoom } from "./MeetingRoom";

export interface BookedBy {
  name: string;
  email: string;
}

export interface Meeting {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  roomId: MeetingRoom;
  bookedBy: BookedBy;
}
