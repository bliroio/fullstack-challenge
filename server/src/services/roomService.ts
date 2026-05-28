import mongoose from "mongoose";
import { IRoom, Room } from "../models/room";
import { ValidationError } from "./meetingService";

export interface CreateRoomInput {
  name?: unknown;
  capacity?: unknown;
}

export const listRooms = async (): Promise<IRoom[]> => {
  return Room.find().sort({ name: 1 });
};

export const createRoom = async (input: CreateRoomInput): Promise<IRoom> => {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name) {
    throw new ValidationError("name is required");
  }

  const capacity = Number(input.capacity);
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new ValidationError("capacity must be a positive integer");
  }

  try {
    return await Room.create({ name, capacity });
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      throw new ValidationError(`A room with name "${name}" already exists`);
    }
    throw error;
  }
};

export const roomExists = async (
  roomId: mongoose.Types.ObjectId | string
): Promise<boolean> => {
  if (!mongoose.isValidObjectId(roomId)) return false;
  const count = await Room.countDocuments({ _id: roomId });
  return count > 0;
};
