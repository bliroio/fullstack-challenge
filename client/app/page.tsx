"use client";

// Home.tsx
import React from "react";
import MeetingList from "./components/meetingList";
import CreateMeetingDrawer from "./components/createMeetingDrawer";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import { Launch, Search } from "@mui/icons-material";

import Logo from "./assets/logo.png";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleCreateMeeting = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleMeetingCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // TODO: Implement search functionality
  };

  return (
    <>
      {/* Full-width Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 3,
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
        <Box sx={{ flex: 1, maxWidth: 700, mx: 3 }}>
          <TextField
            fullWidth
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "white",
                "&:hover": {
                  "& fieldset": {
                    borderColor: "#c0c0c0",
                  },
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                },
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#9e9e9e" }} />
                </InputAdornment>
              ),
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
          <Launch sx={{ mr: 1 }} />
          Create meeting
        </Button>
      </Box>

      {/* Full-width faint divider */}
      <Divider sx={{ 
        borderColor: 'rgba(0, 0, 0, 0.08)',
        opacity: 0.6
      }} />

      {/* Main content with container */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <MeetingList key={refreshKey} />
      </Container>
      
      {/* Create Meeting Drawer */}
      <CreateMeetingDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        onMeetingCreated={handleMeetingCreated}
      />
    </>
  );
};

export default Home;
