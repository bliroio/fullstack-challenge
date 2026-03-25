import mongoose from "mongoose";
import { IMeeting, Meeting } from "../models/meeting";

type ListMeetingsQuery = {
  title?: string;
  startTimeFrom?: string;
  startTimeTo?: string;
};

const escapeRegex = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const listMeetings = async (
  query: ListMeetingsQuery
): Promise<IMeeting[]> => {
  const {
    title,
    startTimeFrom,
    startTimeTo,
  } = query;

  const filters: mongoose.FilterQuery<IMeeting> = {};

  if (title) {
    // Avoid regex injection/ReDoS by escaping user input.
    filters.title = { $regex: new RegExp(escapeRegex(title)), $options: "i" };
  }

  // Calendar range query:
  // Return meetings that OVERLAP the requested window.
  // overlap condition: meeting.startTime <= to AND meeting.endTime >= from
  if (startTimeFrom || startTimeTo) {
    const fromDate = startTimeFrom ? new Date(startTimeFrom) : undefined;
    const toDate = startTimeTo ? new Date(startTimeTo) : undefined;

    const fromValid = fromDate && !Number.isNaN(fromDate.getTime());
    const toValid = toDate && !Number.isNaN(toDate.getTime());

    if (fromValid && toValid) {
      filters.$and = [{ endTime: { $gte: fromDate! } }, { startTime: { $lte: toDate! } }];
    } else if (fromValid) {
      filters.endTime = { $gte: fromDate! };
    } else if (toValid) {
      filters.startTime = { $lte: toDate! };
    }
  }

  return Meeting.find(filters).sort({ startTime: -1 });
};

export const createMeeting = async (payload: any): Promise<IMeeting> => {
  const { title, startTime, endTime } = payload ?? {};

  if (typeof title !== "string" || !title.trim()) {
    throw new Error("title is required");
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime())) {
    throw new Error("startTime is invalid");
  }

  if (Number.isNaN(end.getTime())) {
    throw new Error("endTime is invalid");
  }

  if (end.getTime() <= start.getTime()) {
    throw new Error("endTime must be after startTime");
  }

  const created = await Meeting.create({
    title: title.trim(),
    startTime: start,
    endTime: end,
  });

  return created;
};
