"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { Meeting } from "../../models/Meeting";
import {
  formatDayHeading,
  formatTimeHHmm,
  groupMeetingsByDay,
  toDayKey,
} from "../../utils/meetingUtils";
import { listMeetings } from "../../services/meetingService";
import MeetingAgenda from "./MeetingAgenda";

type Props = {
  refreshNonce: number;
};

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayCellHeight = 92;
const dayGridGapPx = 4; // gap={0.5} in MUI grid ≈ 4px
const calendarPaddingPx = 32; // 16px top + 16px bottom (Paper padding)
const calendarHeaderPx = 44; // month nav row
const calendarWeekdayRowPx = 20;
const calendarSpacingPx = 16; // small internal spacing buffer

export default function MeetingCalendar({ refreshNonce }: Props) {
  const [mounted, setMounted] = useState(false);
  const [monthCursor, setMonthCursor] = useState<Date | null>(null);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const today = new Date();
    setMonthCursor(startOfMonth(today));
    setSelectedDayKey(toDayKey(today));
  }, []);

  const monthRange = useMemo(() => {
    if (!monthCursor) return null;
    const monthStart = startOfMonth(monthCursor);
    const monthEnd = endOfMonth(monthCursor);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return {
      gridStart,
      gridEnd,
      startIso: gridStart.toISOString(),
      endIso: gridEnd.toISOString(),
    };
  }, [monthCursor]);

  useEffect(() => {
    if (!mounted || !monthRange) return;

    let cancelled = false;
    setIsLoading(true);
    setMeetings([]);

    void (async () => {
      const docs = await listMeetings({
        startTimeFrom: monthRange.startIso,
        startTimeTo: monthRange.endIso,
      });

      if (cancelled) return;
      setMeetings(docs);
    })()
      .catch((e) => {
        if (!cancelled) console.error("Failed to load meetings:", e);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mounted, monthRange, refreshNonce]);

  const meetingsByDay = useMemo(() => {
    const grouped = groupMeetingsByDay(meetings);
    for (const key of Object.keys(grouped)) {
      grouped[key] = [...grouped[key]].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    }
    return grouped;
  }, [meetings]);

  const selectedMeetings = useMemo(() => {
    if (!selectedDayKey) return [];
    return meetingsByDay[selectedDayKey] ?? [];
  }, [meetingsByDay, selectedDayKey]);

  const selectedDay = useMemo(() => {
    if (!selectedDayKey) return null;
    return new Date(`${selectedDayKey}T00:00:00`);
  }, [selectedDayKey]);

  if (!mounted || !monthCursor || !monthRange) {
    return (
      <Box sx={{ paddingTop: "16px" }}>
        <Typography variant="body2" sx={{ color: "#6B7280" }}>
          Loading calendar...
        </Typography>
      </Box>
    );
  }

  const { gridStart, gridEnd } = monthRange;
  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
    days.push(d);
  }
  const weekRows = Math.ceil(days.length / 7);
  const calendarGridHeightPx =
    weekRows * dayCellHeight + Math.max(weekRows - 1, 0) * dayGridGapPx;
  const calendarPanelHeightPx =
    calendarPaddingPx + calendarHeaderPx + calendarWeekdayRowPx + calendarSpacingPx + calendarGridHeightPx;

  const onSelectDay = (day: Date) => setSelectedDayKey(toDayKey(day));
  const selectedDayLabel = selectedDay ? formatDayHeading(selectedDay) : "";

  return (
    <Box sx={{ display: "flex", gap: "24px", alignItems: "stretch" }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Paper
          elevation={0}
          sx={{
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E7E8E9",
            height: `${calendarPanelHeightPx}px`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <IconButton
              onClick={() => setMonthCursor((prev) => (prev ? addMonths(prev, -1) : prev))}
              aria-label="Previous month"
              size="small"
              sx={{ border: "1px solid #E7E8E9" }}
            >
              <ChevronLeftIcon />
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {format(monthCursor, "MMMM yyyy")}
            </Typography>

            <IconButton
              onClick={() => setMonthCursor((prev) => (prev ? addMonths(prev, 1) : prev))}
              aria-label="Next month"
              size="small"
              sx={{ border: "1px solid #E7E8E9" }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5 }}>
            {weekdayLabels.map((label) => (
              <Typography
                key={label}
                variant="caption"
                sx={{ color: "#6B7280", fontWeight: 700, textAlign: "center" }}
              >
                {label}
              </Typography>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 0.5,
              mt: 0.5,
            }}
          >
            {days.map((day) => {
              const key = toDayKey(day);
              const dayMeetings = meetingsByDay[key] ?? [];
              const isCurrentMonth = isSameMonth(day, monthCursor);
              const isSelected = selectedDayKey === key;

              return (
                <Paper
                  key={key}
                  elevation={0}
                  onClick={() => onSelectDay(day)}
                  role="button"
                  aria-label={`Select ${key}`}
                  sx={{
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "10px",
                    border: isSelected ? "1px solid #F97316" : "1px solid #E7E8E9",
                    backgroundColor: isSelected ? "#FFF7ED" : "#ffffff",
                    opacity: isCurrentMonth ? 1 : 0.45,
                    height: `${dayCellHeight}px`,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800, mb: 0.5, fontSize: "13px", lineHeight: "18px" }}
                  >
                    {format(day, "d")}
                  </Typography>

                  {dayMeetings.length === 0 ? (
                    <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                      -
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
                      {dayMeetings.slice(0, 2).map((meeting) => (
                        <Typography
                          key={meeting.id}
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            lineHeight: "16px",
                            fontSize: "11px",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {formatTimeHHmm(new Date(meeting.startTime))} {meeting.title}
                        </Typography>
                      ))}
                      {dayMeetings.length > 2 ? (
                        <Typography
                          variant="caption"
                          sx={{ color: "#6B7280", fontSize: "11px", mt: "auto" }}
                        >
                          +{dayMeetings.length - 2} more
                        </Typography>
                      ) : null}
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>
        </Paper>
      </Box>

      <Box sx={{ width: "360px", minWidth: "360px" }}>
        <Paper
          elevation={0}
          sx={{
            height: `${calendarPanelHeightPx}px`,
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E7E8E9",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
          }}
        >
          <MeetingAgenda
            selectedDay={selectedDay}
            meetings={selectedMeetings}
            isLoading={isLoading}
            maxListHeight={calendarPanelHeightPx - 120}
          />

          <Box sx={{ mt: "auto", pt: 1.5 }}>
            {selectedDay ? (
              <Typography variant="caption" sx={{ color: "#9CA3AF", display: "block" }}>
                Selected: {selectedDayLabel}
              </Typography>
            ) : null}
            <Typography variant="caption" sx={{ color: "#9CA3AF", display: "block", mt: 0.5 }}>
              {isLoading ? "Loading…" : `Showing ${meetings.length} meetings in view`}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

