"use client";

import { Card, Typography } from "@mui/material";
import { differenceInMinutes, formatDuration } from 'date-fns';
import React, { useMemo } from "react";
import { Meeting } from "../models/Meeting";
import { Room } from "../models/Room";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("default", {
    dateStyle: "long",
    timeStyle: "short",
  });
  return formatter.format(date);
};

type Props = {
  meetings: Meeting[];
  rooms: Room[];
}
const MeetingList: React.FC<Props> = ({ meetings, rooms }) => {
  const roomNameById = useMemo(
    () => new Map(rooms.map((r) => [r._id, r.name])),
    [rooms]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {meetings.map((meeting) => (
        <Card key={meeting._id} sx={{ padding: '16px', borderRadius: '4px', border: '1px solid #E7E8E9', boxShadow: '0 1px 1px 0px #131A2614' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: '24px', fontSize: '16px' }}>{meeting.title}</Typography>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <img src="/calendar.svg" alt="Calendar" style={{ height: '12px', width: '12px' }} />
                <span style={{
                  borderRight: '1px solid #D0D1D4',
                  paddingRight: '8px',
                  marginRight: '8px',
                }}>
                  <Typography variant="h6">
                    {formatDate(meeting.startTime)}
                  </Typography>
                </span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <img src="/timer.svg" alt="Time" style={{ height: '12px', width: '12px' }} />
                <Typography variant="h6" sx={{ borderRight: '1px solid #D0D1D4', paddingRight: '8px', marginRight: '8px' }}>
                  {formatDuration({ minutes: differenceInMinutes(new Date(meeting.endTime), new Date(meeting.startTime)) })}
                </Typography>
              </span>
              <Typography variant="h6" sx={{ color: '#6B7280' }}>
                {roomNameById.get(meeting.roomId) ?? "Unknown room"}
              </Typography>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MeetingList;
