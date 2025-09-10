import { AppBar, Toolbar } from "@mui/material";
import { useState } from "react";
import { Meeting } from "../models/Meeting";

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
      </Toolbar>
    </AppBar>
  );
}
