'use client';

import React, { useEffect, useState } from 'react';
import { listMeetings } from '../services/meetingService';
import { Meeting } from '../models/Meeting';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('default', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  return formatter.format(date);
};

const MeetingList: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    listMeetings().then(setMeetings);
  }, []);

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
    </Paper>
  );
};

export default MeetingList;
