"use client";

// Home.tsx
import { Box, Button } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FC, useEffect, useState } from "react";
import CreateMeeting from "./components/createMeeting";
import MeetingList from "./components/meetingList";
import { Meeting } from "./models/Meeting";
import { listMeetings } from "./services/meetingService";

const Home: FC = () => {
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [total, setTotal] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMeetingCreated = async () => {
    setPage(0);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await listMeetings(page, rowsPerPage);
        setMeetings(data.meetings);
        setTotal(data.total);
      } catch (error) {
        console.error("Error loading meetings:", error);
      }
    };

    fetchMeetings();
  }, [page, rowsPerPage, refreshTrigger]);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h2" gutterBottom>
          Meetings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateMeetingOpen(true)}
          sx={{ marginBottom: 2 }}
        >
          Create Meeting
        </Button>
      </Box>
      <CreateMeeting
        isOpen={isCreateMeetingOpen}
        onClose={() => setIsCreateMeetingOpen(false)}
        onMeetingCreated={handleMeetingCreated}
      />
      <MeetingList
        meetings={meetings}
        totalMeetings={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Container>
  );
};

export default Home;
