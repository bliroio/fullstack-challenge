"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ChevronIcon from "../../components/chevronIcon";
import Header from "../../components/header";
import { MeetingRoom } from "../../models/MeetingRoom";
import {
  AvailabilityResponse,
  getRoomAvailability,
  getRoomById,
} from "../../services/meetingRoomService";
import { createMeeting } from "../../services/meetingService";

const DURATIONS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
];

const formatTime = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const computeAvailableSlots = (
  availability: AvailabilityResponse,
  durationMinutes: number,
  selectedDate: Date,
): string[] => {
  const { businessHours, bookedSlots } = availability;

  const [startH, startM] = businessHours.start.split(":").map(Number);
  const [endH, endM] = businessHours.end.split(":").map(Number);
  const businessStartMin = startH * 60 + startM;
  const businessEndMin = endH * 60 + endM;

  // Parse booked slots into minute ranges for the day
  const booked = bookedSlots.map((slot) => {
    const s = new Date(slot.start);
    const e = new Date(slot.end);
    return {
      start: s.getHours() * 60 + s.getMinutes(),
      end: e.getHours() * 60 + e.getMinutes(),
    };
  });

  // Filter out slots in the past if selected date is today
  const now = new Date();
  const isToday = isSameDay(selectedDate, now);
  let earliestMinute = businessStartMin;
  if (isToday) {
    // Round up to next 15-min interval
    const currentMin = now.getHours() * 60 + now.getMinutes();
    earliestMinute = Math.max(
      businessStartMin,
      Math.ceil(currentMin / 15) * 15,
    );
  }

  const slots: string[] = [];

  for (let slotStart = earliestMinute; slotStart + durationMinutes <= businessEndMin; slotStart += 15) {
    const slotEnd = slotStart + durationMinutes;

    // Check if this slot overlaps with any booked slot
    const hasConflict = booked.some(
      (b) => slotStart < b.end && slotEnd > b.start,
    );

    if (!hasConflict) {
      slots.push(formatTime(Math.floor(slotStart / 60), slotStart % 60));
    }
  }

  return slots;
};

const generateICS = (
  meetingTitle: string,
  startDate: Date,
  endDate: Date,
  location: string,
  organizerName: string,
  organizerEmail: string,
): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatICSDate = (d: Date): string => {
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  };

  const now = new Date();
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@youwork`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//YouWork//Meeting Room Booking//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${meetingTitle}`,
    `LOCATION:${location}`,
    `ORGANIZER;CN=${organizerName}:mailto:${organizerEmail}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

const downloadICS = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

type Step = "select" | "confirm";

const RoomDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  // Room data
  const [room, setRoom] = useState<MeetingRoom | null>(null);
  const [loading, setLoading] = useState(true);

  // Date & duration selection
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [duration, setDuration] = useState(30);

  // Availability
  const [availability, setAvailability] =
    useState<AvailabilityResponse | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Booking flow
  const [step, setStep] = useState<Step>("select");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load room
  useEffect(() => {
    getRoomById(roomId)
      .then(setRoom)
      .catch(() => setError("Room not found"))
      .finally(() => setLoading(false));
  }, [roomId]);

  // Load availability when date changes
  const fetchAvailability = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const data = await getRoomAvailability(roomId, dateStr);
      setAvailability(data);
    } catch {
      setError("Failed to load availability");
    } finally {
      setLoadingSlots(false);
    }
  }, [roomId, selectedDate]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Compute available slots
  const availableSlots = useMemo(() => {
    if (!availability) return [];
    return computeAvailableSlots(availability, duration, selectedDate);
  }, [availability, duration, selectedDate]);

  // Week days for the strip
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot);
    setStep("confirm");
    setError(null);
  };

  const handleBack = () => {
    setStep("select");
    setSelectedSlot(null);
    setTitle("");
    setName("");
    setEmail("");
    setError(null);
    setSuccess(false);
  };

  const getEndTime = (): string => {
    if (!selectedSlot) return "";
    const [h, m] = selectedSlot.split(":").map(Number);
    const totalMin = h * 60 + m + duration;
    return formatTime(Math.floor(totalMin / 60), totalMin % 60);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!title.trim()) { setError("Meeting title is required"); return; }
    if (!name.trim()) { setError("Your name is required"); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Valid email address is required"); return;
    }

    setSubmitting(true);

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const startTime = new Date(`${dateStr}T${selectedSlot}:00`);
      const endTime = new Date(`${dateStr}T${getEndTime()}:00`);

      await createMeeting({
        title: title.trim(),
        roomId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        bookedBy: { name: name.trim(), email: email.trim() },
      });

      await fetchAvailability();
      setSuccess(true);
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const message = errors?.length
        ? errors.map((e: any) => e.message).join(". ")
        : err?.response?.data?.message || "Failed to book meeting";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!room) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            Room not found
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Back button */}
        <Button
          onClick={() => router.push("/")}
          sx={{
            color: "#71767D",
            textTransform: "none",
            px: 0,
            mb: 2,
            "&:hover": { backgroundColor: "transparent", color: "#131A26" },
          }}
        >
          <ChevronIcon direction="left" size={16} />
          &nbsp;All rooms
        </Button>

        {/* Room info card with image */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            gap: 2.5,
            border: "1px solid #E7E8E9",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={room.imageUrl}
            alt={room.name}
            sx={{
              width: 200,
              height: 140,
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <Box sx={{ py: 2, pr: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              {room.name}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={room.location}
                size="small"
                sx={{ backgroundColor: "#F0F1F2", color: "#424852" }}
              />
              <Chip
                label={`Up to ${room.capacity} people`}
                size="small"
                sx={{ backgroundColor: "#F0F1F2", color: "#424852" }}
              />
            </Box>
          </Box>
        </Box>

        {/* Success state */}
        {success && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography
              sx={{ fontSize: "20px", fontWeight: 600, color: "#131A26", mb: 1 }}
            >
              Meeting booked!
            </Typography>
            <Typography sx={{ color: "#71767D", mb: 1 }}>
              {room.name} &middot; {format(selectedDate, "EEEE, MMMM d")}
            </Typography>
            <Typography sx={{ color: "#71767D", mb: 3 }}>
              {selectedSlot} - {getEndTime()} ({DURATIONS.find((d) => d.value === duration)?.label})
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  const dateStr = format(selectedDate, "yyyy-MM-dd");
                  const startTime = new Date(`${dateStr}T${selectedSlot}:00`);
                  const endTime = new Date(`${dateStr}T${getEndTime()}:00`);
                  const ics = generateICS(
                    title,
                    startTime,
                    endTime,
                    `${room.name} — ${room.location}`,
                    name,
                    email,
                  );
                  downloadICS(ics, `${title || "meeting"}.ics`);
                }}
              >
                Add to calendar
              </Button>
              <Button variant="contained" onClick={handleBack}>
                Book another
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 1: Select date, duration, and time slot */}
        {!success && step === "select" && (
          <>
            {/* Month navigator */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
              }}
            >
              <IconButton
                size="small"
                onClick={() => {
                  const prevMonth = subMonths(selectedDate, 1);
                  const firstDay = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const target = firstDay < today ? today : firstDay;
                  setSelectedDate(target);
                  setWeekStart(startOfWeek(target, { weekStartsOn: 1 }));
                }}
              >
                <ChevronIcon direction="left" />
              </IconButton>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#131A26",
                  minWidth: "160px",
                  textAlign: "center",
                }}
              >
                {format(selectedDate, "MMMM yyyy")}
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  const nextMonth = addMonths(selectedDate, 1);
                  const firstDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
                  setSelectedDate(firstDay);
                  setWeekStart(startOfWeek(firstDay, { weekStartsOn: 1 }));
                }}
              >
                <ChevronIcon direction="right" />
              </IconButton>
            </Box>

            {/* Week strip */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                border: "1px solid #E7E8E9",
                borderRadius: "8px",
                p: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={() => setWeekStart(addDays(weekStart, -7))}
              >
                <ChevronIcon direction="left" size={18} />
              </IconButton>

              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "space-around",
                }}
              >
                {weekDays.map((day) => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isPast =
                    day < new Date(new Date().setHours(0, 0, 0, 0));
                  const isCurrentMonth = isSameMonth(day, selectedDate);

                  return (
                    <Box
                      key={day.toISOString()}
                      onClick={() => !isPast && setSelectedDate(day)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: isPast ? "default" : "pointer",
                        opacity: isPast ? 0.3 : isCurrentMonth ? 1 : 0.5,
                        backgroundColor: isSelected ? "#F26835" : "transparent",
                        color: isSelected ? "#fff" : "#131A26",
                        borderRadius: "8px",
                        px: 1.5,
                        py: 1,
                        minWidth: "48px",
                        transition: "background-color 0.15s",
                        "&:hover": isPast
                          ? {}
                          : {
                              backgroundColor: isSelected
                                ? "#F26835"
                                : "#F0F1F2",
                            },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 500,
                          textTransform: "uppercase",
                        }}
                      >
                        {format(day, "EEE")}
                      </Typography>
                      <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                        {format(day, "d")}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              <IconButton
                size="small"
                onClick={() => setWeekStart(addDays(weekStart, 7))}
              >
                <ChevronIcon direction="right" size={18} />
              </IconButton>
            </Box>

            {/* Date label + duration selector */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                sx={{ fontSize: "16px", fontWeight: 600, color: "#131A26" }}
              >
                {format(selectedDate, "EEEE, MMMM d")}
              </Typography>

              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={duration}
                  label="Duration"
                  onChange={(e) => setDuration(e.target.value as number)}
                >
                  {DURATIONS.map((d) => (
                    <MenuItem key={d.value} value={d.value}>
                      {d.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Available slots */}
            {loadingSlots && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={28} />
              </Box>
            )}

            {!loadingSlots && availableSlots.length === 0 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography sx={{ color: "#71767D" }}>
                  No available slots for this day and duration
                </Typography>
              </Box>
            )}

            {!loadingSlots && availableSlots.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant="outlined"
                    onClick={() => handleSlotClick(slot)}
                    sx={{
                      minWidth: "80px",
                      borderColor: "#E7E8E9",
                      color: "#131A26",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "#F26835",
                        borderColor: "#F26835",
                        color: "#fff",
                      },
                    }}
                  >
                    {slot}
                  </Button>
                ))}
              </Box>
            )}
          </>
        )}

        {/* Step 2: Confirm and enter details */}
        {!success && step === "confirm" && (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              maxWidth: 400,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            <Button
              onClick={handleBack}
              sx={{
                alignSelf: "flex-start",
                color: "#71767D",
                textTransform: "none",
                px: 0,
                "&:hover": { backgroundColor: "transparent", color: "#131A26" },
              }}
            >
              &larr; Back
            </Button>

            {/* Selected time summary */}
            <Box
              sx={{
                p: 2,
                backgroundColor: "#F9FAFB",
                borderRadius: "8px",
                border: "1px solid #E7E8E9",
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#131A26" }}>
                {room.name}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#71767D", mt: 0.5 }}>
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#71767D" }}>
                {selectedSlot} - {getEndTime()} ({DURATIONS.find((d) => d.value === duration)?.label})
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Meeting Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />

            <TextField
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              sx={{ mt: 1 }}
            >
              {submitting ? "Booking..." : "Schedule Meeting"}
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
};

export default RoomDetailPage;
