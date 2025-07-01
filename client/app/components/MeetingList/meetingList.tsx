'use client';

import { useMeeting } from '@/app/context/MeetingContext';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import React from 'react';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('default', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  return formatter.format(date);
};

const MeetingList: React.FC = () => {
  const {
    meetings,
    loadingState: { loading, error },
  } = useMeeting();

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}
      >
        {/* todo testen */}
        <Typography color='error' variant='body1'>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Paper elevation={3}>
        <List sx={{ display: 'flex', flexDirection: 'column' }}>
          {meetings.map((meeting, index) => (
            <React.Fragment key={meeting.id}>
              <ListItem key={meeting.id} alignItems='flex-start'>
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
