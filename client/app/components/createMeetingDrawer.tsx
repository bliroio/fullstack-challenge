"use client";

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller } from "react-hook-form";
import { Close } from "@mui/icons-material";
import { createMeeting } from "../services/meetingService";

interface CreateMeetingForm {
  title: string;
  startTime: Date | null;
  endTime: Date | null;
}

interface CreateMeetingDrawerProps {
  open: boolean;
  onClose: () => void;
  onMeetingCreated: () => void;
}

const CreateMeetingDrawer: React.FC<CreateMeetingDrawerProps> = ({
  open,
  onClose,
  onMeetingCreated,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateMeetingForm>({
    defaultValues: {
      title: "",
      startTime: null,
      endTime: null,
    },
  });

  const startTime = watch("startTime");

  const onSubmit = async (data: CreateMeetingForm) => {
    if (!data.startTime || !data.endTime) {
      setError("Please select both start and end times");
      return;
    }

    if (data.endTime <= data.startTime) {
      setError("End time must be after start time");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createMeeting({
        title: data.title,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
      });

      reset();
      onMeetingCreated();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.details 
        ? err.response.data.details.join(", ")
        : err.response?.data?.message || "Failed to create meeting";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: 400,
            p: 3,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ flex: 1, fontWeight: 600 }}>
            Create Meeting
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Meeting title is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Meeting Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name="startTime"
              control={control}
              rules={{ required: "Start time is required" }}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  label="Start Time"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startTime,
                      helperText: errors.startTime?.message,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="endTime"
              control={control}
              rules={{ required: "End time is required" }}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  label="End Time"
                  minDateTime={startTime || undefined}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endTime,
                      helperText: errors.endTime?.message,
                    },
                  }}
                />
              )}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                fullWidth
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: "#FF6B35",
                  "&:hover": {
                    backgroundColor: "#E85A2B",
                  },
                }}
              >
                {loading ? "Creating..." : "Create Meeting"}
              </Button>
            </Box>
          </Box>
        </form>
      </Drawer>
    </LocalizationProvider>
  );
};

export default CreateMeetingDrawer;