"use client";

// Home.tsx
import React from "react";
import MeetingList from "./components/meetingList";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Logo from "./assets/logo.png";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleCreateMeeting = () => {
    // TODO: Implement create meeting functionality
    console.log("Create meeting clicked");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // TODO: Implement search functionality
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header with logo, search, and create button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          gap: 3,
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={Logo.src}
            alt="Logo"
            style={{
              height: "24px",
              width: "86px",
            }}
          />
        </Box>

        {/* Search Input */}
        <Box sx={{ flex: 1, maxWidth: 400, mx: 3 }}>
          <TextField
            fullWidth
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
                "&:hover": {
                  backgroundColor: "#eeeeee",
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                },
              },
            }}
          />
        </Box>

        {/* Create Meeting Button */}
        <Button
          variant="contained"
          onClick={handleCreateMeeting}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.5,
            backgroundColor: "#FF6B35",
            fontSize: "16px",
            boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)",
            "&:hover": {
              backgroundColor: "#E85A2B",
              boxShadow: "0 4px 12px rgba(255, 107, 53, 0.4)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          ✏️ Create meeting
        </Button>
      </Box>

      {/* Main content */}
      <MeetingList />
    </Container>
  );
};

export default Home;
