"use client";

import { Button, Card, Typography } from "@mui/material";
import { differenceInMinutes, formatDuration } from 'date-fns';
import React from "react";
import { Meeting } from "../models/Meeting";
import { useCountdown } from "../hooks/useCountdown";
import { getNextUpcomingMeeting, isMeetingInProgress } from "../utils/meetingUtils";

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
}
const MeetingList: React.FC<Props> = ({ meetings }) => {
  const nextMeeting = getNextUpcomingMeeting(meetings);
  console.log(nextMeeting);
  const countdown = useCountdown(nextMeeting ? new Date(nextMeeting.startTime) : null);
  console.log(countdown);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {meetings.map((meeting) => {
        const isNextMeeting = nextMeeting?.id === meeting.id;
        const isInProgress = isMeetingInProgress(meeting);
        const shouldHighlight = isNextMeeting && countdown.isActive && countdown.minutesRemaining <= 4;
        const shouldShowJoinButton = shouldHighlight || isInProgress;
        console.log(meeting.id, isNextMeeting, isInProgress, shouldHighlight, shouldShowJoinButton)
        
        return (
          <Card 
            key={meeting.id} 
            sx={{ 
              padding: '16px', 
              borderRadius: '4px', 
              border: shouldHighlight ? '2px solid #FF6B35' : '1px solid #E7E8E9',
              backgroundColor: '#FFF5F2',
              boxShadow: shouldHighlight ? '0 2px 8px rgba(255, 107, 53, 0.15)' : '0 1px 1px 0px #131A2614'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    lineHeight: '24px', 
                    fontSize: '16px',
                    color: shouldHighlight ? '#1A1A1A' : 'inherit',
                  }}
                >
                  {meeting.title}
                </Typography>
                {isNextMeeting && countdown.isActive && countdown.minutesRemaining <= 59 && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '12px',
                      color: shouldHighlight ? '#FF6B35' : '#666666',
                      fontWeight: shouldHighlight ? 600 : 400,
                      backgroundColor: shouldHighlight ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    Starts in: {countdown.formattedTime}
                  </Typography>
                )}
                {isInProgress && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '12px',
                      color: '#28A745',
                      fontWeight: 600,
                      backgroundColor: 'rgba(40, 167, 69, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    In progress
                  </Typography>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
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
                    <Typography variant="h6">
                      {formatDuration({ minutes: differenceInMinutes(new Date(meeting.endTime), new Date(meeting.startTime)) })}
                    </Typography>
                  </span>
                </div>
                
                {shouldShowJoinButton && (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#FF6B35',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '6px 12px',
                      borderRadius: '4px',
                      textTransform: 'none',
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: '#E55A2B',
                      },
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                    Join now
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default MeetingList;
