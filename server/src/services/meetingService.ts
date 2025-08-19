import mongoose from "mongoose";
import z from "zod";
import Meeting, { IMeeting } from "../models/meeting";

const CreateMeeting = z
  .object({
    title: z.string(),
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: "startTime must be before endTime",
    path: ["startTime"],
  });

const listMeetings = async (
  query: any
): Promise<mongoose.PaginateResult<IMeeting>> => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;

  return Meeting.paginate(
    {},
    { page, limit, sort: { startTime: "ascending" } }
  );
};

const createMeeting = async (data: unknown): Promise<IMeeting> => {
  const parsed = CreateMeeting.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const meeting = new Meeting(parsed.data);
  return meeting.save();
};

export default { listMeetings, createMeeting };
