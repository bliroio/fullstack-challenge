"use client";

// Home.tsx
import { Box, Button } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FC, useState } from "react";
import CreateMeeting from "./components/createMeeting";
import MeetingList from "./components/meetingList";

const Home: FC = () => {
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);

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
      />
      <MeetingList />
    </Container>
  );
};

export default Home;
