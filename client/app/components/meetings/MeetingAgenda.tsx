"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import type { Meeting } from "../../models/Meeting";
import { formatDayHeading } from "../../utils/meetingUtils";
import MeetingCard from "./MeetingCard";

type Props = {
  selectedDay: Date | null;
  meetings: Meeting[];
};

export default function MeetingAgenda({ selectedDay, meetings }: Props) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {selectedDay ? `Agenda • ${formatDayHeading(selectedDay)}` : "Agenda"}
      </Typography>

      {meetings.length === 0 ? (
        <Typography variant="body2" sx={{ color: "#6B7280" }}>
          No meetings for this day.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {meetings.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </Box>
      )}
    </Box>
  );
}

