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

interface ListProps {
  search: string,
  refresh: number
};

interface ListCompProps {
  heading: string;
  list: Meeting[]
}

const MeetingList: React.FC<ListProps> = ({search, refresh}) => {
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [pastMeetings, setPastMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    const list = async () => {
      const { upcomingMeetings, pastMeetings } = await listMeetings({ title: search });
      if (upcomingMeetings && Array.isArray(upcomingMeetings.docs)) {
        setUpcomingMeetings(upcomingMeetings.docs);
      }
      if (pastMeetings && Array.isArray(pastMeetings.docs)) {
        console.log("setting past meeting")
        setPastMeetings(pastMeetings.docs);
      }
    }
    list();
  }, [search, refresh]);

  const ListComp = ({heading, list}: ListCompProps) => {
    
    return (
       <>
        <Typography variant="h4" gutterBottom>{heading}</Typography>
        <List >
          {list.map((meeting, index) => (
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
    )
  }

  return (
    <>
      <ListComp heading={"Upcoming Meetings"} list={upcomingMeetings}/>
      <ListComp heading={"Past Meetings"} list={pastMeetings}/>
    </>
  );
};

export default MeetingList;
