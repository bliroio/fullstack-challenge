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
