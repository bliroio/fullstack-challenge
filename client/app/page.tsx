"use client";

// Home.tsx
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import Header from "./components/header";
import MeetingCalendar from "./components/meetings/MeetingCalendar";
import type { Meeting } from "./models/Meeting";
import { createMeeting } from "./services/meetingService";

const Home: React.FC = () => {
  const [refreshNonce, setRefreshNonce] = useState(0);

  const onCreateMeeting = async (meeting: Omit<Meeting, "id">) => {
    await createMeeting(meeting);
    setRefreshNonce((v) => v + 1);
  };

  return (
    <>
      <Header onCreateMeeting={onCreateMeeting} />
      <Container maxWidth="md" sx={{ paddingTop: "24px" }}>
        <Typography variant="h4" gutterBottom>
          My Meetings
        </Typography>
        <MeetingCalendar refreshNonce={refreshNonce} />
      </Container>
    </>
  );
};

export default Home;
