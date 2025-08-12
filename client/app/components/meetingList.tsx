"use client";

import { TablePagination } from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import { Meeting } from "../models/Meeting";
import { listMeetings } from "../services/meetingService";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("default", {
    dateStyle: "long",
    timeStyle: "short",
  });
  return formatter.format(date);
};

const MeetingList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    listMeetings(page, rowsPerPage).then((data) => {
      setMeetings(data.meetings);
      setTotal(data.total);
    });
  }, [page, rowsPerPage]);

  return (
    <Paper elevation={3}>
      <List>
        {meetings.map((meeting, index) => (
          <React.Fragment key={meeting.id}>
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
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default MeetingList;
