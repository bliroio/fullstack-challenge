"use client";

// Home.tsx
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React, { useCallback, useEffect, useState } from "react";
import Header from "./components/header";
import MeetingList from "./components/meetingList";
import type { Meeting } from "shared/schemas/meeting";
import { createMeeting, listMeetings } from "./services/meetingService";

const Home: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMeetings = useCallback(() => {
    const params = searchQuery ? { title: searchQuery } : undefined;
    listMeetings(params).then(setMeetings);
  }, [searchQuery]);

  const onCreateMeeting = async (meeting: Omit<Meeting, "id">) => {
    await createMeeting(meeting);
    fetchMeetings();
  };

  const onSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  return (
    <>
      <Header onCreateMeeting={onCreateMeeting} onSearch={onSearch} />
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
