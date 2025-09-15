import { Meeting } from '../models/Meeting';

export const getNextUpcomingMeeting = (meetings: Meeting[]): Meeting | null => {
  if (!meetings || meetings.length === 0) return null;

  const now = new Date();
  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  return upcomingMeetings[0] || null;
};

export const isMeetingInProgress = (meeting: Meeting): boolean => {
  const now = new Date();
  const startTime = new Date(meeting.startTime);
  const endTime = new Date(meeting.endTime);
  return now >= startTime && now <= endTime;
};
