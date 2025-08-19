"use client";

import { TablePagination } from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import { Meeting } from "../models/Meeting";

interface Props {
  meetings: Meeting[];
  totalMeetings: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("default", {
    dateStyle: "long",
    timeStyle: "short",
  });
  return formatter.format(date);
};

const formatDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const duration = end.getTime() - start.getTime();

  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

const formatTimeUntilMeeting = (startTime: string) => {
  const startTimeDate = new Date(startTime);
  const currentTimeDate = new Date();

  // TODO: throw error if date order not correct
  // TODO: What if meeting is in the past?

  const msDifferenceToStart =
    startTimeDate.getTime() - currentTimeDate.getTime();

  const hours = Math.floor(msDifferenceToStart / (1000 * 60 * 60));
  const minutes = Math.floor(
    (msDifferenceToStart % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((msDifferenceToStart % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const addTimeUntilMeetingToMeetings = (meetings: Meeting[]) => {
  return meetings.map((meeting) => ({
    ...meeting,
    timeUntilMeeting: formatTimeUntilMeeting(meeting.startTime),
  }));
};

const MeetingList: React.FC<Props> = ({
  meetings,
  totalMeetings,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const handlePageChange = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    onRowsPerPageChange(newRowsPerPage);
  };

  const [rerenderCounter, setRenderCounter] = useState(0);

  const meetingsWithTimeUntilMeeting = addTimeUntilMeetingToMeetings(meetings);

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderCounter(rerenderCounter + 1);
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <Paper elevation={3}>
      <List>
        {meetingsWithTimeUntilMeeting.map((meeting, index) => (
          <React.Fragment key={meeting.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={meeting.title}
                secondary={
                  <>
                    <div>Start: {formatDate(meeting.startTime)}</div>
                    <div>End: {formatDate(meeting.endTime)}</div>
                    <div>
                      Duration:{" "}
                      {formatDuration(meeting.startTime, meeting.endTime)}
                    </div>
                    <div>Meeting in {meeting.timeUntilMeeting}</div>
                  </>
                }
              />
            </ListItem>
            {index < meetings.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
      <TablePagination
        component="div"
        count={totalMeetings}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Paper>
  );
};

export default MeetingList;
