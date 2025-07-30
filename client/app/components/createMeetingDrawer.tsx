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
import { Add, Remove } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useForm, Controller } from "react-hook-form";
import { Close } from "@mui/icons-material";
import { createMeeting } from "../services/meetingService";

interface CreateMeetingForm {
  title: string;
  startTime: Date | null;
  endTime: Date | null;
  attendees: string[];
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
    setValue,
    getValues,
  } = useForm<CreateMeetingForm>({
    defaultValues: {
      title: "",
      startTime: null,
      endTime: null,
      attendees: [""],
    },
  });

  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const attendees = watch("attendees");

  const addAttendee = () => {
    const currentAttendees = getValues("attendees");
    setValue("attendees", [...currentAttendees, ""]);
  };

  const removeAttendee = (index: number) => {
    const currentAttendees = getValues("attendees");
    if (currentAttendees.length > 1) {
      setValue("attendees", currentAttendees.filter((_, i) => i !== index));
    }
  };

  const updateAttendee = (index: number, value: string) => {
    const currentAttendees = getValues("attendees");
    const updatedAttendees = [...currentAttendees];
    updatedAttendees[index] = value;
    setValue("attendees", updatedAttendees);
  };

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
      // Filter out empty attendee names
      const validAttendees = data.attendees.filter(name => name.trim() !== "");
      
      await createMeeting({
        title: data.title,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        attendees: validAttendees,
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

  // Helper function to combine date and time
  const combineDateTime = (date: Date | null, time: Date | null): Date | null => {
    if (!date || !time) return null;
    const combined = new Date(date);
    combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return combined;
  };

  // Helper function to extract date part
  const extractDate = (dateTime: Date | null): Date | null => {
    if (!dateTime) return null;
    const date = new Date(dateTime);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // Helper function to extract time part
  const extractTime = (dateTime: Date | null): Date | null => {
    if (!dateTime) return null;
    const time = new Date();
    time.setHours(dateTime.getHours(), dateTime.getMinutes(), 0, 0);
    return time;
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

            {/* Start time section */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Start time <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Controller
                  name="startTime"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      value={extractDate(field.value)}
                      onChange={(newValue) => {
                        const currentTime = extractTime(field.value) || new Date();
                        const combined = combineDateTime(newValue, currentTime);
                        field.onChange(combined);
                      }}
                      format="dd MMM. yyyy"
                      slotProps={{
                        textField: {
                          placeholder: "18 Feb. 2025",
                          error: !!errors.startTime,
                          sx: { flex: 1 }
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="startTime"
                  control={control}
                  rules={{ required: "Start time is required" }}
                  render={({ field }) => (
                    <TimePicker
                      value={extractTime(field.value)}
                      onChange={(newValue) => {
                        const currentDate = extractDate(field.value) || new Date();
                        const combined = combineDateTime(currentDate, newValue);
                        field.onChange(combined);
                      }}
                      format="HH:mm"
                      ampm={false}
                      slotProps={{
                        textField: {
                          placeholder: "11:15",
                          error: !!errors.startTime,
                          sx: { width: 100 }
                        },
                      }}
                    />
                  )}
                />
              </Box>
              {errors.startTime && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors.startTime.message}
                </Typography>
              )}
            </Box>

            {/* End time section */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                End time <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Controller
                  name="endTime"
                  control={control}
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      value={extractDate(field.value)}
                      onChange={(newValue) => {
                        const currentTime = extractTime(field.value) || new Date();
                        const combined = combineDateTime(newValue, currentTime);
                        field.onChange(combined);
                      }}
                      format="dd MMM. yyyy"
                      minDate={extractDate(startTime) || undefined}
                      slotProps={{
                        textField: {
                          placeholder: "18 Feb. 2025",
                          error: !!errors.endTime,
                          sx: { flex: 1 }
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
                    <TimePicker
                      value={extractTime(field.value)}
                      onChange={(newValue) => {
                        const currentDate = extractDate(field.value) || new Date();
                        const combined = combineDateTime(currentDate, newValue);
                        field.onChange(combined);
                      }}
                      format="HH:mm"
                      ampm={false}
                      slotProps={{
                        textField: {
                          placeholder: "11:30",
                          error: !!errors.endTime,
                          sx: { width: 100 }
                        },
                      }}
                    />
                  )}
                />
              </Box>
              {errors.endTime && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors.endTime.message}
                </Typography>
              )}
            </Box>

            {/* Attendees Section */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 500 }}>
                  Attendees
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={addAttendee}
                  startIcon={<Add />}
                  sx={{ fontSize: "12px" }}
                >
                  Add Person
                </Button>
              </Box>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Organizer (hardcoded) */}
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <TextField
                    fullWidth
                    size="small"
                    value="Alex Potapov (Organizer)"
                    disabled
                    sx={{ 
                      flex: 1,
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#333",
                        backgroundColor: "#f5f5f5"
                      }
                    }}
                  />
                </Box>
                
                {/* Dynamic attendees */}
                {attendees.map((attendee, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Attendee ${index + 1} name`}
                      value={attendee}
                      onChange={(e) => updateAttendee(index, e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    {attendees.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removeAttendee(index)}
                        sx={{ color: "#666" }}
                      >
                        <Remove />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

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