"use client";

import React from "react";
import { listMeetings } from "../services/meetingService";
import { Meeting } from "../models/Meeting";
import {
  Box,
  Typography,
  Paper,
  Chip,
} from "@mui/material";
import { format, differenceInMinutes } from "date-fns";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "d MMM, yyyy - HH:mm");
};

const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const minutes = differenceInMinutes(end, start);
  return `${minutes} min`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming":
      return "info";
    case "in_progress":
      return "warning";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "upcoming":
      return "Upcoming";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

const MeetingList: React.FC = () => {
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);

  React.useEffect(() => {
    listMeetings().then((data) => {
      setMeetings(data);
    });
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: "#333" }}>
        My meetings
      </Typography>
      
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {meetings.map((meeting) => (
          <Paper
            key={meeting._id}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #e5e5e5",
              backgroundColor: "#fff",
              cursor: "pointer",
              "&:hover": {
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderColor: "#d0d0d0",
              },
            }}
          >
            {/* Meeting Title */}
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500,
                fontSize: "16px",
                color: "#1a1a1a",
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              {meeting.title}
            </Typography>
            
            {/* Meeting Metadata Row */}
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 3,
              color: "#666",
              fontSize: "14px",
            }}>
              {/* Date & Time */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>📅</Typography>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>
                  {formatDate(meeting.startTime)}
                </Typography>
              </Box>
              
              {/* Duration */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>⏰</Typography>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>
                  {calculateDuration(meeting.startTime, meeting.endTime)}
                </Typography>
              </Box>
              
              {/* Status Chip */}
              <Chip
                label={getStatusLabel(meeting.status)}
                size="small"
                color={getStatusColor(meeting.status) as any}
                sx={{
                  height: "20px",
                  fontSize: "12px",
                  fontWeight: 500,
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
              
              {/* Attendee Count */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>👥</Typography>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>
                  {meeting.attendees.length}
                </Typography>
              </Box>
              
              {/* Attendees List */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>👤</Typography>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>
                  {meeting.attendees.length > 0 ? (
                    meeting.attendees.map(attendee => attendee.name).join(", ")
                  ) : (
                    "No attendees listed"
                  )}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default MeetingList;
