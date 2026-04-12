import mongoose from "mongoose";
import { Meeting } from "../models/meeting";
import { CreateMeetingInput } from "shared/schemas/meeting";
import { escapeRegExp } from "../utils/escapeRegExp";
import { AppError } from "../utils/AppError";

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
    sort: { startTime: 1 },
  };

  const filters: Record<string, unknown> = {};

  if (title) {
    filters.title = new RegExp(escapeRegExp(title), "i");
  }

  return Meeting.paginate(filters, options);
};

export const createMeeting = async (
  data: CreateMeetingInput
): Promise<InstanceType<typeof Meeting>> => {
  return Meeting.create(data);
};

export const deleteMeeting = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid meeting ID");
  }
  const result = await Meeting.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, "Meeting not found");
  }
};
