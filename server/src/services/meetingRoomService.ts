import MeetingRoom, { IMeetingRoom } from "../models/meetingRoom";

const listRooms = async (): Promise<IMeetingRoom[]> => {
  return MeetingRoom.find().sort({ name: 1 });
};

const getRoomById = async (id: string): Promise<IMeetingRoom | null> => {
  return MeetingRoom.findById(id);
};

export default { listRooms, getRoomById };
