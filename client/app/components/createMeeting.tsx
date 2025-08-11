import { Box, Button, Drawer, TextField, Typography } from "@mui/material";
import { FC, FormEvent } from "react";
import { createMeeting } from "../services/meetingService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMeeting: FC<Props> = ({ isOpen, onClose }) => {
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const title = formData.get("title");
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");

    if (!title || title === "" || !startTime || !endTime) {
      return;
    }

    const data = {
      title: title as string,
      startTime: new Date(startTime as string).toISOString(),
      endTime: new Date(endTime as string).toISOString(),
    };

    createMeeting(data);

    onClose();
  };

  return (
    <Drawer anchor="right" open={isOpen} variant="temporary">
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" gutterBottom>
            Create a new meeting
          </Typography>
          <Button onClick={onClose}>Close</Button>
        </Box>

        <form onSubmit={onSubmit}>
          <TextField
            label="Meeting title"
            name="title"
            required
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Start time"
            name="startTime"
            type="datetime-local"
            required
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End time"
            name="endTime"
            type="datetime-local"
            required
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Create Meeting
          </Button>
        </form>
      </Box>
    </Drawer>
  );
};

export default CreateMeeting;
