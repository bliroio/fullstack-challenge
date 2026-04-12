"use client";

// Home.tsx
import Container from "@mui/material/Container";
import Pagination from "@mui/material/Pagination";
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMeetings = useCallback(async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params: { page: number; title?: string } = { page: pageNum };
      if (searchQuery) params.title = searchQuery;
      const data = await listMeetings(params);
      setMeetings(data.docs);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      setError("Failed to load meetings. Please try again.");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    fetchMeetings(value);
  };

  const onCreateMeeting = async (meeting: Omit<Meeting, "id">) => {
    await createMeeting(meeting);
    fetchMeetings(1);
  };

  const onDeleteMeeting = async (id: string) => {
    await deleteMeeting(id);
    fetchMeetings(page);
  };

  const onSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    fetchMeetings(1);
  }, [fetchMeetings]);

  return (
    <>
      <Header onCreateMeeting={onCreateMeeting} onSearch={onSearch} />
      <Container maxWidth="md" sx={{ paddingTop: "24px" }}>
        <Typography variant="h4" gutterBottom>
          My Meetings
        </Typography>
        <MeetingList meetings={meetings} loading={loading} error={error} onDelete={onDeleteMeeting} />
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            sx={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "24px",
              paddingBottom: "24px",
            }}
          />
        )}
      </Container>
    </>
  );
};

export default Home;
