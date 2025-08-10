"use client";

import React, { useEffect, useState } from "react";
import { listMeetings, cancelMeeting } from "../services/meetingService";
import styles from "@/app/page.module.css";
import { Meeting } from "../models/Meeting";
import { ListItemDetail } from "./ListItemDetails";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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
        setPastMeetings(pastMeetings.docs);
      }
    }
    list();
  }, [search, refresh]);

  const ListComp = ({heading, list}: ListCompProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, meetingId: string) => {
      setAnchorEl(event.currentTarget);
      setSelectedMeetingId(meetingId);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
      setSelectedMeetingId(null);
    };

    const handleCancel = (meetingId: string) => {
      // TODO: Implement cancel logic here
      cancelMeeting(meetingId).then(() => {
        alert(`Meeting cancelled with id: ${meetingId}`);
      })
      
      handleMenuClose();
    };
    
    return (
       <>
        <Typography variant="h5" gutterBottom>{heading}</Typography>
        <List >
          {list.map((meeting, index) => (
            <React.Fragment key={meeting._id}>
              <Paper variant="outlined" elevation={0} square={false} className={styles.card}>
                <ListItem key={meeting._id}
                 alignItems="flex-start"
                 secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="actions"
                        onClick={e => handleMenuOpen(e, meeting._id)}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedMeetingId === meeting._id}
                        onClose={handleMenuClose}
                      >
                        <MenuItem dense={true} onClick={() => handleCancel(meeting._id)}>Cancel</MenuItem>
                      </Menu>
                    </>
                  }
                 >
                  <ListItemText
                    primary={meeting.title}
                    secondary={ 
                    <ListItemDetail 
                      startTime={meeting.startTime}
                      endTime={meeting.endTime}
                      status={meeting.status}
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
