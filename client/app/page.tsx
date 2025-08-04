"use client";

// Home.tsx
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import Header from "./components/header";
import MeetingList from "./components/meetingList";
import { Meeting } from "./models/Meeting";
import { createMeeting, listMeetings } from "./services/meetingService";

const Home: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const onCreateMeeting = async (meeting: Omit<Meeting, "id">) => {
    return createMeeting(meeting).then(listMeetings).then(setMeetings);
  }

  useEffect(() => {
    listMeetings().then(setMeetings);
  }, []);

  return (
    <>
      <Header onCreateMeeting={onCreateMeeting} />
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
