"use client";

import React from "react";
import { Card, Typography } from "@mui/material";
import type { Meeting } from "../../models/Meeting";
import { formatDayHeading, formatDurationMinutes, formatTimeHHmm } from "../../utils/meetingUtils";

type Props = {
  meeting: Meeting;
};

export default function MeetingCard({ meeting }: Props) {
  const start = new Date(meeting.startTime);

  return (
    <Card
      sx={{
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #E7E8E9",
        boxShadow: "0 1px 1px 0px #131A2614",
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: "16px", lineHeight: "24px" }}>
        {meeting.title}
      </Typography>
      <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
        {formatDayHeading(start)} • {formatTimeHHmm(start)}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.75 }}>
        {formatDurationMinutes(meeting.startTime, meeting.endTime)}
      </Typography>
    </Card>
  );
}

