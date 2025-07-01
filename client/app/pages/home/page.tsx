'use client';

import React from 'react';
import MeetingList from '../../components/MeetingList/meetingList';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useCreateMeeting } from '../../context/CreateMeetingContext';
import { Box } from '@mui/material';
import NavBar from '@/app/components/NavBar/navBar';

const Home: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: 'white' }}>
      <NavBar />
      <Container maxWidth='lg' sx={{ pt: 3 }}>
        <Typography variant='h5' gutterBottom sx={{ mb: 2 }}>
          My meetings
        </Typography>
        <MeetingList />
      </Container>
    </Box>
  );
};

export default Home;
