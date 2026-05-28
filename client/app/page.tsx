"use client";

// Home.tsx
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import Header from "./components/header";
import MeetingList from "./components/meetingList";
import { Meeting } from "./models/Meeting";
import { Room } from "./models/Room";
import { createMeeting, listMeetings } from "./services/meetingService";
import { listRooms } from "./services/roomService";

const Home: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const onCreateMeeting = async (meeting: Omit<Meeting, "_id">) => {
    return createMeeting(meeting).then(listMeetings).then(setMeetings);
  };

  useEffect(() => {
    listMeetings().then(setMeetings);
    listRooms().then(setRooms);
  }, []);

  return (
    <>
      <Header onCreateMeeting={onCreateMeeting} rooms={rooms} />
      <Container maxWidth="md" sx={{ paddingTop: "24px" }}>
        <Typography variant="h4" gutterBottom>
          My Meetings
        </Typography>
        <MeetingList meetings={meetings} rooms={rooms} />
      </Container>
    </>
  );
};

export default Home;
