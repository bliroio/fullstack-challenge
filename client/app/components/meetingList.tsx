"use client";

import React from "react";
import { listMeetings, cancelMeeting } from "../services/meetingService";
import { Meeting } from "../models/Meeting";
import CountdownWidget from "./countdownWidget";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedMeetingId, setSelectedMeetingId] = React.useState<string | null>(null);
  
  // Mock current user ID (since we don't have auth)
  const currentUserId = 'user_1';

  React.useEffect(() => {
    listMeetings().then((data) => {
      setMeetings(data);
    });
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, meetingId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedMeetingId(meetingId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMeetingId(null);
  };

  const handleCancelMeeting = async () => {
    if (!selectedMeetingId) return;
    
    try {
      await cancelMeeting(selectedMeetingId);
      // Refresh the meetings list
      const updatedMeetings = await listMeetings();
      setMeetings(updatedMeetings);
      handleMenuClose();
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      // TODO: Show error message to user
      handleMenuClose();
    }
  };

  const selectedMeeting = meetings.find(m => m._id === selectedMeetingId);
  const canCancelMeeting = selectedMeeting?.userId === currentUserId;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: "#333" }}>
        My meetings
      </Typography>
      
      {/* Countdown Widget */}
      <CountdownWidget meetings={meetings} />
      
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
              position: "relative",
              "&:hover": {
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderColor: "#d0d0d0",
              },
            }}
          >
            {/* Meeting Title and Menu */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#1a1a1a",
                  lineHeight: 1.2,
                  flex: 1,
                  pr: 2,
                }}
              >
                {meeting.title}
              </Typography>
              
              {/* Three dot menu */}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e, meeting._id);
                }}
                sx={{ 
                  color: "#666",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" }
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
            
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
                    (() => {
                      const attendeeNames = meeting.attendees.map(attendee => {
                        const nameParts = attendee.name.split(' ');
                        if (nameParts.length >= 2) {
                          return `${nameParts[0]} ${nameParts[1].charAt(0)}.`;
                        }
                        return attendee.name;
                      });
                      
                      if (attendeeNames.length <= 3) {
                        return attendeeNames.join(", ");
                      } else {
                        const firstThree = attendeeNames.slice(0, 3).join(", ");
                        const remaining = attendeeNames.length - 3;
                        return `${firstThree} + ${remaining} others`;
                      }
                    })()
                  ) : (
                    "No attendees listed"
                  )}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
      
      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {canCancelMeeting && (
          <MenuItem 
            onClick={handleCancelMeeting}
            sx={{ 
              color: '#d32f2f',
              '&:hover': { 
                backgroundColor: 'rgba(211, 47, 47, 0.04)' 
              }
            }}
          >
            Cancel Meeting
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default MeetingList;
