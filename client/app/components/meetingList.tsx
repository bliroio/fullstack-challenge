"use client";

import React from "react";
import { listMeetings } from "../services/meetingService";
import { Meeting } from "../models/Meeting";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import { format, differenceInMinutes } from "date-fns";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "d MMM, yyyy - HH:mm");
};

const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMins = differenceInMinutes(end, start);
  return `${diffMins} min`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "success";
    case "Scheduled":
      return "info";
    case "In Progress":
      return "warning";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

const getCallTypeColor = (callType: string) => {
  switch (callType) {
    case "Sales calls":
      return "#ff6b35";
    case "Marketing calls":
      return "#ff8a65";
    case "Discovery calls":
      return "#ffab40";
    default:
      return "#9e9e9e";
  }
};

// Mock function to add missing data for demo purposes
const enhanceMeetingData = (meeting: Meeting): Meeting => {
  const mockStatuses = ["Delivered", "Scheduled", "In Progress"];
  const mockCallTypes = ["Sales calls", "Marketing calls", "Discovery calls"];
  const mockAttendees = [
    ["Peter S.", "Martin T.", "Maurice S."],
    ["John D.", "Sarah W.", "Mike R."],
    ["Anna K.", "David L.", "Lisa M."],
  ];

  const randomIndex = Math.floor(Math.random() * 3);
  
  return {
    ...meeting,
    status: mockStatuses[randomIndex] as any,
    callType: mockCallTypes[randomIndex] as any,
    attendeeCount: Math.floor(Math.random() * 20) + 5,
    attendees: mockAttendees[randomIndex],
  };
};

const MeetingList: React.FC = () => {
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);

  React.useEffect(() => {
    listMeetings().then((data) => {
      const enhancedMeetings = data.map(enhanceMeetingData);
      setMeetings(enhancedMeetings);
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
            key={meeting.id}
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
              {meeting.status && (
                <Chip
                  label={meeting.status}
                  size="small"
                  sx={{
                    height: "20px",
                    fontSize: "12px",
                    fontWeight: 500,
                    backgroundColor: meeting.status === "Delivered" ? "#e8f5e8" : "#f0f0f0",
                    color: meeting.status === "Delivered" ? "#2e7d32" : "#666",
                    border: "none",
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              )}
              
              {/* Attendee Count */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>👥</Typography>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>
                  {meeting.attendeeCount}
                </Typography>
              </Box>
              
              {/* Attendees List */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>👤</Typography>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>
                  {meeting.attendees ? (
                    <>
                      {meeting.attendees.join(", ")}
                      {meeting.attendeeCount && meeting.attendeeCount > meeting.attendees.length && 
                        `, +${meeting.attendeeCount - meeting.attendees.length} others`
                      }
                    </>
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
