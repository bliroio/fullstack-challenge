import { AppBar, Button, Snackbar, Toolbar } from "@mui/material";
import { useState } from "react";
import { Meeting } from "../models/Meeting";
import CreateMeetingDrawer from "./createMeetingDrawer";

type Props = {
  onCreateMeeting: (meeting: Omit<Meeting, "id">) => Promise<void>;
};
export default function Header({ onCreateMeeting }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleCreateMeeting = async (meeting: Omit<Meeting, "id">) => {
    try {
      await onCreateMeeting(meeting);
      setDrawerOpen(false);

      showFeedback("Meeting created successfully");
    } catch (error) {
      console.error("Error creating meeting:", error);
      showFeedback("Error creating meeting" + error);

      throw error;
    }
  };

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setFeedbackOpen(true);
  }

  return (
    <>
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src="/bliro_logo.svg" alt="Bliro Logo" style={{ height: 24 }} />
        <Button color="inherit" onClick={() => setDrawerOpen(true)}>
          Create Meeting
        </Button>
      </Toolbar>
    </AppBar>
    <CreateMeetingDrawer
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      onCreateMeeting={handleCreateMeeting}
    ></CreateMeetingDrawer>
    <Snackbar
      open={feedbackOpen}
      autoHideDuration={6000}
      onClose={() => setFeedbackOpen(false)}
      message={feedbackMessage}
    />
    </>
  );
}
