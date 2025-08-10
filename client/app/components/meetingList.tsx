"use client";

import React, { useEffect, useState } from "react";
import { listMeetings } from "../services/meetingService";
import { Meeting } from "../models/Meeting";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ListItemDetail } from "./ListItemDetails";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import styles from "@/app/page.module.css";
import { Typography } from "@mui/material";


const MeetingList: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    const list = async () => {
      const meetings = await listMeetings();
      setMeetings(meetings.docs);
    }
    list();
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>My Meetings</Typography>
      <List >
        {meetings.map((meeting, index) => (
          <React.Fragment key={meeting._id}>
            <Paper variant="outlined" elevation={0} square={false} className={styles.card}>
              <ListItem key={meeting._id} alignItems="flex-start">
                <ListItemText
                  primary={meeting.title}
                  secondary={ 
                  <ListItemDetail 
                    startTime={meeting.startTime}
                    endTime={meeting.endTime}
                  />
                  }
                />
              </ListItem>
            </Paper>
          </React.Fragment>
        ))}
      </List>
    </>
  );
};

export default MeetingList;
