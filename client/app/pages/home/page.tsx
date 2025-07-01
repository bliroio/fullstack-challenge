'use client';

import React from 'react';
import MeetingList from '../../components/MeetingList/meetingList';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useCreateMeeting } from '../../context/CreateMeetingContext';

const Home: React.FC = () => {
  const { meetings, loading, error } = useCreateMeeting();

  if (error) {
    return (
      <Container maxWidth='md'>
        <Typography variant='h2' gutterBottom>
          Meetings
        </Typography>
        <Typography color='error' variant='body1'>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth='md'>
      <Typography variant='h2' gutterBottom>
        Meetings
      </Typography>
      <MeetingList />
    </Container>
  );
};

export default Home;
