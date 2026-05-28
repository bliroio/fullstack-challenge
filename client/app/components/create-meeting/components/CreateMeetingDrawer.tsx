"use client";

import { Box, Drawer } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Meeting } from "../../../models/Meeting";
import { Room } from "../../../models/Room";
import { CreateMeetingForm } from "./CreateMeetingForm";
import { CreateMeetingHeader } from "./CreateMeetingHeader";

interface CreateMeetingDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreateMeeting: (meeting: Omit<Meeting, "_id">) => Promise<void>;
  rooms: Room[];
}

const CreateMeetingDrawer: React.FC<CreateMeetingDrawerProps> = ({
  open,
  onClose,
  onCreateMeeting,
  rooms,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: 400,
            height: "100%",
            padding: 0,
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
          }}
        >
          <CreateMeetingHeader onClose={onClose} />
          <CreateMeetingForm
            onSubmit={onCreateMeeting}
            onClose={onClose}
            rooms={rooms}
          />
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
};

export default CreateMeetingDrawer;
