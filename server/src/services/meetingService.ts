import mongoose from "mongoose";
import { IMeeting, Meeting } from "../models/meeting";

export const listMeetings = async (
  query: any
): Promise<mongoose.PaginateResult<IMeeting>> => {
  const { page = 1, limit = 10, ...filters } = query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  const options = {
    page: pageNum,
    limit: limitNum,
    sort: { startTime: -1 },
  };

  if (filters.title) {
    filters.title = { $regex: new RegExp(filters.title), $options: "i" };
  }

  return Meeting.paginate(filters, options);
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
