"use client";

import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "./components/header";
import RoomCard from "./components/roomCard";
import { MeetingRoom } from "./models/MeetingRoom";
import { listRooms } from "./services/meetingRoomService";

const Home: React.FC = () => {
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    listRooms()
      .then(setRooms)
      .catch(() => setError("Failed to load rooms. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ paddingTop: "24px", paddingBottom: "24px" }}>
        <Typography variant="h4" gutterBottom>
          Meeting Rooms
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="error">
              {error}
            </Typography>
          </Box>
        )}

        {!loading && !error && rooms.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ color: "#71767D" }}>
              No meeting rooms available
            </Typography>
          </Box>
        )}

        {!loading && !error && rooms.length > 0 && (
          <Grid container spacing={2}>
            {rooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room._id}>
                <RoomCard
                  room={room}
                  onClick={() => router.push(`/rooms/${room._id}`)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Home;
