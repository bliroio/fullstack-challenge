import mongoose from "mongoose";
import { Meeting } from "../models/meeting";
import { escapeRegExp } from "../utils/escapeRegExp";

interface ListMeetingsQuery {
  page: number;
  limit: number;
  title?: string;
}

export const listMeetings = async (
  query: ListMeetingsQuery
): Promise<mongoose.PaginateResult<InstanceType<typeof Meeting>>> => {
  const { page = 1, limit = 10, title } = query;

  const options = {
    page,
    limit,
    sort: { startTime: -1 },
  };

  const filters: Record<string, unknown> = {};

  if (title) {
    filters.title = new RegExp(escapeRegExp(title), "i");
  }

  return Meeting.paginate(filters, options);
};
