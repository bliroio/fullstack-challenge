import { AppBar, Box, Button, Drawer, Toolbar } from "@mui/material";
import React, { useState } from "react";
import { Meeting } from "../models/Meeting";
import MeetingForm from "@/app/components/MeetingForm";

type Props = {
  onCreateMeeting: (meeting: Omit<Meeting, "id">) => Promise<void>;
};
export default function Header({ onCreateMeeting }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleCreateMeeting = async (meeting: Omit<Meeting, "id">) => {
    try {
      await onCreateMeeting(meeting);
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };
  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src="/bliro_logo.svg" alt="Bliro Logo" style={{ height: 24 }} />

        <Button
          variant="contained"
          color="primary"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          {"Create Meeting"}
        </Button>
      </Toolbar>

      <Drawer
        anchor={"right"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          role="dialog"
          aria-labelledby="side-title"
          sx={{ width: 380, p: 2 }} // set your panel width here
        >
          <MeetingForm onSubmitMeeting={handleCreateMeeting} />
        </Box>
      </Drawer>
    </AppBar>
  );
}
