import {
  Alert,
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
} from "@mui/material";
import { FC, FormEvent, useState } from "react";
import { createMeeting } from "../services/meetingService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onMeetingCreated: () => void;
}

const CreateMeeting: FC<Props> = ({ isOpen, onClose, onMeetingCreated }) => {
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const title = formData.get("title");
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");

    if (!title || title === "" || !startTime || !endTime) {
      setFormError("All fields are required.");
      return;
    }

    const startTimeDate = new Date(startTime as string);
    const endTimeDate = new Date(endTime as string);

    if (startTimeDate >= endTimeDate) {
      setFormError("Start time must be before end time.");
      return;
    }

    const data = {
      title: title as string,
      startTime: startTimeDate.toISOString(),
      endTime: endTimeDate.toISOString(),
    };

    await createMeeting(data);

    onClose();
    setFormError(null);
    onMeetingCreated();
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

        {formError && <Alert severity="error">{formError}</Alert>}

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
