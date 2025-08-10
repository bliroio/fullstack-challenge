"use client";

// Home.tsx
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React from "react";
import CreateMeeting from "./components/createMeeting";
import MeetingList from "./components/meetingList";

const Home: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h2" gutterBottom>
        Meetings
      </Typography>
      <CreateMeeting />
      <MeetingList />
    </Container>
  );
};

export default Home;
