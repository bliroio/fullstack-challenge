'use client';

import { useMeeting } from '@/app/context/MeetingContext';
import { CreateMeeting } from '@/app/models/Meeting';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import React from 'react';
import DateTimeRow from './DateTimeRow';

interface CreateMeetingDrawerProps {
  open: boolean;
  onClose?: () => void;
}

const CreateMeetingDrawer: React.FC<CreateMeetingDrawerProps> = ({ open, onClose }) => {
  const router = useRouter();
  const { refreshMeetings } = useMeeting();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [startTime, setStartTime] = React.useState<Date | null>(new Date());
  const [endTime, setEndTime] = React.useState<Date | null>(new Date());
  const {
    addMeeting,
    creationState: { error, loading },
  } = useMeeting();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    //TODO Input validation
    console.log('startTime', startTime);
    console.log('endTime', endTime);

    // Validate that startTime and endTime are not null
    if (!startTime || !endTime) {
      console.error('Start time and end time are required');
      return;
    }

    // Convert Date objects to ISO strings for the API
    const meetingData: CreateMeeting = {
      title,
      description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    console.log('Creating meeting:', meetingData);

    await addMeeting(meetingData);

    // After creating the meeting, refresh the list
    // handleClose();
  };

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        size='large'
        sx={{ alignSelf: 'flex-end', color: 'lightgrey' }}
      >
        <CloseIcon />
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '0px 32px 0px 32px',
        }}
      >
        <Typography variant='h5'>Create a new meeting</Typography>
        <Typography variant='subtitle1'>
          Complete the information below in order to create a new meeting
        </Typography>

        <Box sx={{ flexGrow: 1, marginTop: '16px', overflow: 'auto' }}>
          <TextField
            fullWidth
            label='Meeting title'
            value={title}
            placeholder='Write your meeting title'
            onChange={(e) => setTitle(e.target.value)}
            margin='normal'
            required
          />

          <DateTimeRow
            label='Start time'
            value={startTime}
            onChange={(newValue: Date | null) => setStartTime(newValue)}
            required={true}
          />

          <DateTimeRow
            label='End time'
            value={endTime}
            onChange={(newValue: Date | null) => setEndTime(newValue)}
            required={true}
          />
          <TextField
            fullWidth
            label='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={3}
            placeholder='Write any notes regarding the meeting'
            required
            sx={{
              '& .MuiOutlinedInput-input': {
                padding: 0,
                margin: 0,
              },
              '& .MuiInputBase-root': {
                padding: 2,
              },
            }}
          />
          {loading && <CircularProgress />}
          {error && <Typography color='error'>{error}</Typography>}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, p: 3, borderTop: '1px solid lightgrey' }}>
        <Button variant='outlined' onClick={handleClose} sx={{ flex: 1 }}>
          Cancel
        </Button>
        <Button type='submit' variant='contained' sx={{ flex: 1 }} onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Drawer>
  );
};

export default CreateMeetingDrawer;
