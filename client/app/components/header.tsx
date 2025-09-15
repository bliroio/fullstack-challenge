import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useState } from "react";
import { Meeting } from "../models/Meeting";
import { CreateMeetingModal } from "./create-meeting-modal";
import createMeetingIcon from "./icons/arrow-up-right-square.svg";
import { CountdownState } from "../hooks/useCountdown";

type Props = {
  onCreateMeeting: (meeting: Omit<Meeting, "id">) => Promise<void>;
  nextMeeting?: Meeting | null;
  countdown?: CountdownState;
  meetings?: Meeting[];
};

export default function Header({ onCreateMeeting, nextMeeting, countdown, meetings }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const shouldShowNextMeeting = nextMeeting && countdown && countdown.isActive && countdown.minutesRemaining <= 4;
  const currentMeeting = meetings?.find(meeting => {
    const now = new Date();
    const startTime = new Date(meeting.startTime);
    const endTime = new Date(meeting.endTime);
    return now >= startTime && now <= endTime;
  });
  
  const shouldShowCurrentMeeting = !shouldShowNextMeeting && currentMeeting;
  const shouldShowNotification = shouldShowNextMeeting || shouldShowCurrentMeeting;
  console.log(shouldShowCurrentMeeting);
  console.log(shouldShowNotification);

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src="/bliro_logo.svg" alt="Bliro Logo" style={{ height: 24 }} />
        
        {shouldShowNotification && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#FFF5F2',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #FF6B35',
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ color: '#00000000', fontWeight: 600, fontSize: '14px' }}>
                {shouldShowNextMeeting ? nextMeeting?.title : currentMeeting?.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#4b4a4aff', fontSize: '12px' }}>
                {shouldShowNextMeeting 
                  ? `Starts in: ${countdown?.formattedTime}` 
                  : 'In progress'
                }
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#FF6B35',
                color: 'white',
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
                textTransform: 'none'
              }}
            >
              Join now
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}