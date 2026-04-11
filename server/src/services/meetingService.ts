import mongoose from "mongoose";
import Meeting, { IMeeting, IMeetingCreate } from "../models/meeting";

// Per-room mutex to prevent race conditions on concurrent bookings.
// Serializes check+create for the same room so two requests can't
// both pass the conflict check before either writes.
const roomLocks = new Map<string, Promise<any>>();

const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const listMeetings = async (
  query: any,
): Promise<mongoose.PaginateResult<IMeeting>> => {
  const { page = 1, limit = 10, ...filters } = query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  const options = {
    page: pageNum,
    limit: limitNum,
    sort: { startTime: -1 },
    select: "-bookedBy -title",
    populate: { path: "roomId", select: "name location" },
  };

  if (filters.title) {
    filters.title = { $regex: escapeRegex(filters.title), $options: "i" };
  }

  return Meeting.paginate(filters, options);
};

const checkConflict = async (
  roomId: string,
  startTime: Date,
  endTime: Date,
): Promise<boolean> => {
  const conflict = await Meeting.findOne({
    roomId,
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  });
  return !!conflict;
};

const getAvailability = async (
  roomId: string,
  date: string,
): Promise<{ start: string; end: string }[]> => {
  const dayStart = new Date(`${date}T00:00:00.000Z`);
  const dayEnd = new Date(`${date}T23:59:59.999Z`);

  const meetings = await Meeting.find({
    roomId,
    startTime: { $lt: dayEnd },
    endTime: { $gt: dayStart },
  }).sort({ startTime: 1 });

  return meetings.map((m) => ({
    start: m.startTime.toISOString(),
    end: m.endTime.toISOString(),
  }));
};

const createMeeting = async (meeting: IMeetingCreate): Promise<IMeeting> => {
  const roomId = meeting.roomId.toString();
  const pending = roomLocks.get(roomId) ?? Promise.resolve();

  const operation = pending.then(async () => {
    const hasConflict = await checkConflict(
      roomId,
      meeting.startTime,
      meeting.endTime,
    );

    if (hasConflict) {
      throw new Error("ROOM_CONFLICT");
    }

    const created = await Meeting.create(meeting);
    return created.populate("roomId", "name location capacity imageUrl");
  });

  // Store the chain; swallow rejections so future bookings aren't blocked
  roomLocks.set(roomId, operation.catch(() => {}));
  return operation;
};

export default { listMeetings, createMeeting, getAvailability };
