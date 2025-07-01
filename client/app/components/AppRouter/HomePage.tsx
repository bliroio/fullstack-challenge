'use client';

import React from 'react';
import MeetingList from '../MeetingList/meetingList';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth='md'>
      <Typography variant='h2' gutterBottom>
        Meetings
      </Typography>
      <MeetingList />
    </Container>
  );
};

export default HomePage;
