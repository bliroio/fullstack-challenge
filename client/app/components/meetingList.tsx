"use client";

import { Box, Card, Grid, Typography } from "@mui/material";
import { differenceInMinutes, formatDuration } from "date-fns";
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

const MeetingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => (
  <Card
    sx={{
      padding: "12px 16px",
      borderRadius: "4px",
      border: "1px solid #E7E8E9",
      boxShadow: "0 1px 1px 0px #131A2614",
    }}
  >
    <Typography sx={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
      {meeting.title}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px", color: "#6B7280" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <img src="/calendar.svg" alt="" style={{ height: 12, width: 12 }} />
        <Typography variant="caption">{formatDate(meeting.startTime)}</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <img src="/timer.svg" alt="" style={{ height: 12, width: 12 }} />
        <Typography variant="caption">
          {formatDuration({
            minutes: differenceInMinutes(
              new Date(meeting.endTime),
              new Date(meeting.startTime)
            ),
          })}
        </Typography>
      </Box>
    </Box>
  </Card>
);

type Props = {
  meetings: Meeting[];
  rooms: Room[];
};

const MeetingList: React.FC<Props> = ({ meetings, rooms }) => {
  const meetingsByRoom = useMemo(() => {
    const map = new Map<string, Meeting[]>();
    for (const room of rooms) {
      map.set(room._id, []);
    }
    for (const meeting of meetings) {
      const bucket = map.get(meeting.roomId);
      if (bucket) {
        bucket.push(meeting);
      }
    }
    Array.from(map.values()).forEach((bucket) =>
      bucket.sort(
        (a: Meeting, b: Meeting) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
    );
    return map;
  }, [meetings, rooms]);

  if (rooms.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: "#6B7280" }}>
        No rooms available yet.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {rooms.map((room) => {
        const roomMeetings = meetingsByRoom.get(room._id) ?? [];
        return (
          <Grid key={room._id} item xs={12} sm={6} md={4} lg={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {room.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  capacity {room.capacity} · {roomMeetings.length} booking
                  {roomMeetings.length === 1 ? "" : "s"}
                </Typography>
              </Box>
              {roomMeetings.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                  No meetings booked.
                </Typography>
              ) : (
                roomMeetings.map((meeting) => (
                  <MeetingCard key={meeting._id} meeting={meeting} />
                ))
              )}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MeetingList;
