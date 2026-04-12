"use client";

// Home.tsx
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React, { useCallback, useEffect, useState } from "react";
import Header from "./components/header";
import MeetingList from "./components/meetingList";
import type { Meeting } from "shared/schemas/meeting";
import { createMeeting, deleteMeeting, listMeetings } from "./services/meetingService";

const Home: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = searchQuery ? { title: searchQuery } : undefined;
      const data = await listMeetings(params);
      setMeetings(data);
    } catch (err) {
      setError("Failed to load meetings. Please try again.");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const onCreateMeeting = async (meeting: Omit<Meeting, "id">) => {
    await createMeeting(meeting);
    fetchMeetings();
  };

  const onDeleteMeeting = async (id: string) => {
    await deleteMeeting(id);
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
        <MeetingList meetings={meetings} loading={loading} error={error} onDelete={onDeleteMeeting} />
      </Container>
    </>
  );
};

export default Home;
