"use client";

import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import type { Meeting } from "../../models/Meeting";
import { formatDayHeading } from "../../utils/meetingUtils";
import MeetingCard from "./MeetingCard";

type Props = {
  selectedDay: Date | null;
  meetings: Meeting[];
  maxListHeight?: number;
  isLoading?: boolean;
};

export default function MeetingAgenda({
  selectedDay,
  meetings,
  maxListHeight,
  isLoading = false,
}: Props) {
  return (
    <Box>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 1,
          pb: 1.25,
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: "16px", lineHeight: "24px" }}>
          {selectedDay ? formatDayHeading(selectedDay) : "Agenda"}
        </Typography>
        <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>
          {isLoading
            ? "Loading…"
            : `${meetings.length} meeting${meetings.length === 1 ? "" : "s"}`}
        </Typography>
        <Divider sx={{ mt: 1.25 }} />
      </Box>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxHeight: maxListHeight,
          overflowY: maxListHeight ? "auto" : "visible",
          pr: 0,
          scrollbarGutter: "stable",
          "&::-webkit-scrollbar": {
            width: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#F3F4F6",
            borderRadius: "999px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#D1D5DB",
            borderRadius: "999px",
            border: "2px solid #F3F4F6",
          },
        }}
      >
        {!isLoading && meetings.length === 0 ? (
          <Box sx={{ padding: "12px", borderRadius: "10px", backgroundColor: "#F9FAFB" }}>
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              No meetings for this day.
            </Typography>
          </Box>
        ) : (
          meetings.map((m) => <MeetingCard key={m.id} meeting={m} />)
        )}
      </Box>
    </Box>
  );
}

