import { differenceInMinutes, format, formatDuration } from "date-fns";
import { Meeting } from "../models/Meeting";

export const toDayKey = (date: Date): string => format(date, "yyyy-MM-dd");

export const groupMeetingsByDay = (meetings: Meeting[]): Record<string, Meeting[]> => {
  return meetings.reduce<Record<string, Meeting[]>>((acc, meeting) => {
    const key = toDayKey(new Date(meeting.startTime));
    acc[key] = acc[key] ?? [];
    acc[key].push(meeting);
    return acc;
  }, {});
};

export const formatTimeHHmm = (date: Date): string => format(date, "HH:mm");

export const formatDayHeading = (date: Date): string => format(date, "EEEE, MMM d");

export const formatDurationMinutes = (startTime: string, endTime: string): string => {
  const minutes = differenceInMinutes(new Date(endTime), new Date(startTime));
  return formatDuration({ minutes: Math.max(0, minutes) });
};

