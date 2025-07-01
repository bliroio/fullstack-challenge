'use client';

import React from 'react';
import MeetingList from '../../components/MeetingList/meetingList';
import CreateMeetingDrawer from '../../components/CreateMeetingDrawer/CreateMeetingDrawer';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useCreateMeeting } from '../../context/CreateMeetingContext';

export default function CreateMeetingPage() {
  const { meetings, loading, error } = useCreateMeeting();

  if (error) {
    return (
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container maxWidth='md'>
          <Typography variant='h2' gutterBottom>
            Meetings
          </Typography>
          <Typography color='error' variant='body1'>
            {error}
          </Typography>
        </Container>
        <CreateMeetingDrawer open={true} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container maxWidth='md'>
        <Typography variant='h2' gutterBottom>
          Meetings
        </Typography>
        <MeetingList />
      </Container>
      <CreateMeetingDrawer open={true} />
    </Box>
  );
}
