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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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

        <Box component='form' onSubmit={handleSubmit} sx={{ flexGrow: 1, marginTop: '16px' }}>
          <TextField
            fullWidth
            label='Meeting title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin='normal'
            required
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
            {/* Start time row */}

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <DatePicker
                label='Start time'
                value={startTime}
                onChange={(newValue: Date | null) => setStartTime(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    required: true,
                  },
                }}
              />
              <TimePicker
                sx={{ alignSelf: 'flex-end' }}
                label=' '
                value={startTime}
                onChange={(newValue: Date | null) => setStartTime(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    required: true,
                    InputLabelProps: {
                      required: false,
                    },
                  },
                }}
              />
            </Box>

            {/* End time row */}

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <DatePicker
                label='End time'
                value={endTime}
                onChange={(newValue: Date | null) => setEndTime(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    required: true,
                  },
                }}
              />
              <TimePicker
                label='Time'
                value={endTime}
                onChange={(newValue: Date | null) => setEndTime(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    required: true,
                    InputLabelProps: {
                      required: false,
                    },
                  },
                }}
              />
            </Box>
          </LocalizationProvider>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, p: 3, borderTop: '1px solid lightgrey' }}>
        <Button variant='outlined' onClick={handleClose} sx={{ flex: 1 }}>
          Cancel
        </Button>
        <Button type='submit' variant='contained' sx={{ flex: 1 }}>
          Save
        </Button>
      </Box>
    </Drawer>
  );
};

export default CreateMeetingDrawer;
