"use client";

// Home.tsx
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React from "react";
import Header from "./components/header";
import MeetingList from "./components/meetingList";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ paddingTop: "24px" }}>
        <Typography variant="h4" gutterBottom>
          My Meetings
        </Typography>
        <MeetingList />
      </Container>
    </>
  );
};

export default Home;
