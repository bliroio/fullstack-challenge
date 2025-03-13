"use client";

import React, { useEffect, useState } from "react";
import { listMeetings } from "../services/meetingService";
import { Meeting } from "../models/Meeting";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import io from "socket.io-client";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("default", {
    dateStyle: "long",
    timeStyle: "short",
  });
  return formatter.format(date);
};

const MeetingList: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  useEffect(() => {
    fetchMeetings(page);
    const socket = io("http://localhost:3000");
    socket.on("meetingUpdated", (updatedMeeting: Meeting) => {
      setMeetings((prevMeetings) =>
        prevMeetings.map((m) =>
          m._id === updatedMeeting._id ? updatedMeeting : m
        )
      );
    });

    // Listen for deletions
    socket.on("meetingDeleted", (deletedId: string) => {
      setMeetings((prevMeetings) =>
        prevMeetings.filter((m) => m._id !== deletedId)
      );
    });

    return () => {
      socket.off("meetingUpdated");
      socket.off("meetingDeleted");
    };
  }, [page]);

  const fetchMeetings = async (currentPage: number) => {
    try {
      const response = await listMeetings(currentPage);
      console.log("API Response:", response);

      setMeetings(response.docs); // Update the list with the current page's meetings
      setTotalPages(response.totalPages); // Total number of pages
      setHasNextPage(response.hasNextPage); // Is there a next page?
      setHasPrevPage(response.hasPrevPage); // Is there a previous page?
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  return (
    <Paper elevation={3}>
      <List>
        {meetings.map((meeting, index) => (
          <React.Fragment key={meeting._id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={meeting.title}
                secondary={
                  <>
                    <div>Start: {formatDate(meeting.startTime)}</div>
                    <div>End: {formatDate(meeting.endTime)}</div>
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

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setPage(page - 1)}
          disabled={!hasPrevPage}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="contained"
          onClick={() => setPage(page + 1)}
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>
    </Paper>
  );
};

export default MeetingList;
