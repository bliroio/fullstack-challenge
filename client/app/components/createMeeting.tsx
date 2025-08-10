import { Button, Paper, TextField } from "@mui/material";
import { FormEvent } from "react";
import { createMeeting } from "../services/meetingService";

const CreateMeeting = () => {
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
  };

  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
      <form onSubmit={onSubmit}>
        <TextField
          label="Title"
          name="title"
          required
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Start Time"
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
          label="End Time"
          name="endTime"
          type="datetime-local"
          required
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Create Meeting
        </Button>
      </form>
    </Paper>
  );
};

export default CreateMeeting;
