"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import type { Meeting } from "../../models/Meeting";
import { formatDurationMinutes, formatTimeHHmm } from "../../utils/meetingUtils";

type Props = {
  meeting: Meeting;
};

export default function MeetingCard({ meeting }: Props) {
  const start = new Date(meeting.startTime);

  return (
    <Box
      sx={{
        borderRadius: "12px",
        border: "1px solid #E7E8E9",
        backgroundColor: "#ffffff",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        transition: "background-color 120ms ease",
        "&:hover": {
          backgroundColor: "#F9FAFB",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "20px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {meeting.title}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>
          Duration: {formatDurationMinutes(meeting.startTime, meeting.endTime)}
        </Typography>
        <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
          {formatTimeHHmm(start)}
        </Typography>
      </Box>
    </Box>
  );
}

