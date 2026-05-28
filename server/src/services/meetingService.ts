import mongoose from "mongoose";
import { IMeeting, Meeting } from "../models/meeting";
import { roomExists } from "./roomService";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export interface CreateMeetingInput {
  title?: unknown;
  startTime?: unknown;
  endTime?: unknown;
  roomId?: unknown;
}

const parseDate = (value: unknown, field: string): Date => {
  if (typeof value !== "string" && !(value instanceof Date)) {
    throw new ValidationError(`${field} must be an ISO date string`);
  }
  const date = new Date(value as string | Date);
  if (Number.isNaN(date.getTime())) {
    throw new ValidationError(`${field} is not a valid date`);
  }
  return date;
};

export const createMeeting = async (input: CreateMeetingInput): Promise<IMeeting> => {
  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title) {
    throw new ValidationError("title is required");
  }

  const startTime = parseDate(input.startTime, "startTime");
  const endTime = parseDate(input.endTime, "endTime");

  if (endTime <= startTime) {
    throw new ValidationError("endTime must be after startTime");
  }

  const roomId = input.roomId;
  if (typeof roomId !== "string" || !mongoose.isValidObjectId(roomId)) {
    throw new ValidationError("roomId must be a valid room id");
  }
  if (!(await roomExists(roomId))) {
    throw new ValidationError(`Room ${roomId} does not exist`);
  }

  return Meeting.create({ title, startTime, endTime, roomId });
};

export const listMeetings = async (
  query: any
): Promise<mongoose.PaginateResult<IMeeting>> => {
  const { page, limit, ...filters } = query;

  const options: mongoose.PaginateOptions = {
    sort: { startTime: 1 },
  };

  if (limit !== undefined) {
    options.page = parseInt(page as string, 10) || 1;
    options.limit = parseInt(limit as string, 10);
  } else {
    // No limit means: return every upcoming meeting in one response.
    options.pagination = false;
  }

  if (filters.title) {
    filters.title = { $regex: new RegExp(filters.title), $options: "i" };
  }

  // Default to upcoming meetings so the dashboard surfaces what's next and
  // newly-created bookings aren't pushed off the page by historical entries.
  if (filters.endTime === undefined) {
    filters.endTime = { $gte: new Date() };
  }

  return Meeting.paginate(filters, options);
};
