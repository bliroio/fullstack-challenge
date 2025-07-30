"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Meeting } from "../models/Meeting";
import { format, differenceInMilliseconds } from "date-fns";

interface CountdownWidgetProps {
  meetings: Meeting[];
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownWidget: React.FC<CountdownWidgetProps> = ({ meetings }) => {
  const [timeRemaining, setTimeRemaining] = React.useState<TimeRemaining | null>(null);
  const [nextMeeting, setNextMeeting] = React.useState<Meeting | null>(null);
  const [currentMeeting, setCurrentMeeting] = React.useState<Meeting | null>(null);

  const findCurrentMeeting = React.useCallback(() => {
    const now = new Date();
    
    // Find meeting that is currently in progress
    const inProgressMeeting = meetings.find(meeting => {
      const startTime = new Date(meeting.startTime);
      const endTime = new Date(meeting.endTime);
      return now >= startTime && now <= endTime;
    });

    return inProgressMeeting || null;
  }, [meetings]);

  const findNextUpcomingMeeting = React.useCallback(() => {
    const now = new Date();
    
    // Filter upcoming meetings and sort by start time
    const upcomingMeetings = meetings
      .filter(meeting => {
        const startTime = new Date(meeting.startTime);
        return startTime > now;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return upcomingMeetings.length > 0 ? upcomingMeetings[0] : null;
  }, [meetings]);

  const calculateTimeRemaining = React.useCallback((targetDate: Date): TimeRemaining => {
    const now = new Date();
    const diff = differenceInMilliseconds(targetDate, now);

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }, []);

  React.useEffect(() => {
    const current = findCurrentMeeting();
    const next = findNextUpcomingMeeting();
    
    setCurrentMeeting(current);
    setNextMeeting(next);

    if (!next) {
      setTimeRemaining(null);
      return;
    }

    const updateCountdown = () => {
      // Check if we're still in a current meeting or if it ended
      const newCurrent = findCurrentMeeting();
      setCurrentMeeting(newCurrent);
      
      const targetDate = new Date(next.startTime);
      const remaining = calculateTimeRemaining(targetDate);
      setTimeRemaining(remaining);

      // If countdown reaches zero, find the next meeting
      if (remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        const newNext = findNextUpcomingMeeting();
        setNextMeeting(newNext);
      }
    };

    // Update immediately
    updateCountdown();

    // Set up interval to update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [meetings, findCurrentMeeting, findNextUpcomingMeeting, calculateTimeRemaining]);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  // If user is currently in a meeting
  if (currentMeeting) {
    return (
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: "2px solid #4caf50",
          backgroundColor: "#f1f8e9",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: "#4caf50", mb: 2, fontWeight: 600 }}>
          🟢 You are now in a meeting
        </Typography>
        
        <Typography variant="h5" sx={{ color: "#333", mb: 2, fontWeight: 500 }}>
          {currentMeeting.title}
        </Typography>
        
        <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
          Until {format(new Date(currentMeeting.endTime), "HH:mm")}
        </Typography>

        {nextMeeting && timeRemaining ? (
          <>
            <Typography variant="h6" sx={{ color: "#FF6B35", mb: 2, fontWeight: 600 }}>
              Next Meeting: {nextMeeting.title}
            </Typography>
            
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              {timeRemaining.days > 0 && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" sx={{ color: "#FF6B35", fontWeight: 700, lineHeight: 1 }}>
                    {formatTime(timeRemaining.days)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
                    Days
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ color: "#FF6B35", fontWeight: 700, lineHeight: 1 }}>
                  {formatTime(timeRemaining.hours)}
                </Typography>
                <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
                  Hours
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ color: "#FF6B35", fontWeight: 700, lineHeight: 1 }}>
                  {formatTime(timeRemaining.minutes)}
                </Typography>
                <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
                  Minutes
                </Typography>
              </Box>
            </Box>
          </>
        ) : (
          <Typography variant="body2" sx={{ color: "#999" }}>
            No upcoming meetings after this one
          </Typography>
        )}
      </Paper>
    );
  }

  if (!nextMeeting || !timeRemaining) {
    return (
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: "1px solid #e5e5e5",
          backgroundColor: "#f8f9fa",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
          Next Meeting
        </Typography>
        <Typography variant="body1" sx={{ color: "#999" }}>
          No upcoming meetings scheduled
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: "1px solid #FF6B35",
        backgroundColor: "#fff8f5",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" sx={{ color: "#FF6B35", mb: 2, fontWeight: 600 }}>
        Next Meeting
      </Typography>
      
      <Typography variant="h5" sx={{ color: "#333", mb: 2, fontWeight: 500 }}>
        {nextMeeting.title}
      </Typography>
      
      <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
        {format(new Date(nextMeeting.startTime), "EEEE, MMM d, yyyy 'at' HH:mm")}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
        {timeRemaining.days > 0 && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ color: "#FF6B35", fontWeight: 700, lineHeight: 1 }}>
              {formatTime(timeRemaining.days)}
            </Typography>
            <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
              Days
            </Typography>
          </Box>
        )}
        
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ color: "#FF6B35", fontWeight: 700, lineHeight: 1 }}>
            {formatTime(timeRemaining.hours)}
          </Typography>
          <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
            Hours
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ color: "#FF6B35", fontWeight: 700, lineHeight: 1 }}>
            {formatTime(timeRemaining.minutes)}
          </Typography>
          <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
            Minutes
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ color: "#FF6B35", fontWeight: 700, lineHeight: 1 }}>
            {formatTime(timeRemaining.seconds)}
          </Typography>
          <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
            Seconds
          </Typography>
        </Box>
      </Box>

      {timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes < 15 && (
        <Typography variant="body2" sx={{ color: "#FF6B35", fontWeight: 600 }}>
          🚨 Meeting starting soon!
        </Typography>
      )}
    </Paper>
  );
};

export default CountdownWidget;