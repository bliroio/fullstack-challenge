"use client";

// Home.tsx
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import Header from "./components/header";
import MeetingList from "./components/meetingList";
import { Meeting } from "./models/Meeting";
import { createMeeting, listMeetings } from "./services/meetingService";
import { getNextUpcomingMeeting } from "./utils/meetingUtils";
import { useCountdown } from "./hooks/useCountdown";



const Home: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const onCreateMeeting = async (meeting: Omit<Meeting, "id">) => {
    return createMeeting(meeting).then(listMeetings).then(setMeetings);
  }

  useEffect(() => {
    listMeetings().then(setMeetings);
  }, []);

  const nextMeeting = getNextUpcomingMeeting(meetings);
  const countdown = useCountdown(nextMeeting ? new Date(nextMeeting.startTime) : null);
  console.log(countdown);

  return (
    <>
      <Header 
        onCreateMeeting={onCreateMeeting}
        nextMeeting={nextMeeting}
        meetings={meetings}
      />
      <Container maxWidth="md" sx={{ paddingTop: "24px" }}>
        <Typography variant="h4" gutterBottom>
          My Meetings
        </Typography>
        <MeetingList meetings={meetings} />
      </Container>
    </>
  );
};

export default Home;
