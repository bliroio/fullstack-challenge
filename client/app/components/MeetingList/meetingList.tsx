'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listMeetings } from '../../services/meetingService';
import { Meeting } from '../../models/Meeting';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('default', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  return formatter.format(date);
};

const MeetingList: React.FC = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    listMeetings().then((response) => setMeetings(response.docs));
  }, []);

  const handleCreateMeeting = () => {
    navigate('/create-meeting');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant='contained' startIcon={<AddIcon />} onClick={handleCreateMeeting}>
          Neues Meeting
        </Button>
      </Box>

      <Paper elevation={3}>
        <List>
          {meetings.map((meeting, index) => (
            <React.Fragment key={meeting.id}>
              <ListItem alignItems='flex-start'>
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
              {index < meetings.length - 1 && <Divider variant='inset' component='li' />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default MeetingList;
