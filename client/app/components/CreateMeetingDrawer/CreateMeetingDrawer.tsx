'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCreateMeeting } from '../../context/CreateMeetingContext';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { de } from 'date-fns/locale';

interface CreateMeetingDrawerProps {
  open: boolean;
  onClose?: () => void;
}

const CreateMeetingDrawer: React.FC<CreateMeetingDrawerProps> = ({ open, onClose }) => {
  const router = useRouter();
  const { refreshMeetings } = useCreateMeeting();
  const [title, setTitle] = React.useState('');
  const [startTime, setStartTime] = React.useState<Date | null>(new Date());
  const [endTime, setEndTime] = React.useState<Date | null>(new Date());

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement meeting creation logic
    console.log('Creating meeting:', { title, startTime, endTime });

    // After creating the meeting, refresh the list
    await refreshMeetings();
    handleClose();
  };

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          padding: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <IconButton onClick={handleClose} size='large' sx={{ alignSelf: 'flex-end' }}>
          <CloseIcon />
        </IconButton>

        <Typography variant='h5'>Create a new meeting</Typography>
        <Typography variant='subtitle1'>
          Complete the information below in order to create a new meeting
        </Typography>

        <Box component='form' onSubmit={handleSubmit} sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            label='Meeting Titel'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin='normal'
            required
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
            <DateTimePicker
              label='Startzeit'
              value={startTime}
              onChange={(newValue: Date | null) => setStartTime(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  required: true,
                },
              }}
            />

            <DateTimePicker
              label='Endzeit'
              value={endTime}
              onChange={(newValue: Date | null) => setEndTime(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  required: true,
                },
              }}
            />
          </LocalizationProvider>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant='outlined' onClick={handleClose} sx={{ flex: 1 }}>
              Cancel
            </Button>
            <Button type='submit' variant='contained' sx={{ flex: 1 }}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CreateMeetingDrawer;
