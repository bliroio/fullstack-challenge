'use client';

import { useMeeting } from '@/app/context/MeetingContext';
import { CreateMeeting } from '@/app/models/Meeting';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { isAfter, isBefore, isEqual } from 'date-fns';
import { useRouter } from 'next/navigation';
import React from 'react';
import DateTimeRow from './DateTimeRow';

interface CreateMeetingDrawerProps {
  open: boolean;
  onClose?: () => void;
}

interface ValidationErrors {
  title?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
}

const CreateMeetingDrawer: React.FC<CreateMeetingDrawerProps> = ({ open, onClose }) => {
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [startTime, setStartTime] = React.useState<Date | null>(new Date());
  const [endTime, setEndTime] = React.useState<Date | null>(new Date());
  const [validationErrors, setValidationErrors] = React.useState<ValidationErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

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

  const validateField = (field: string, value: any): string | undefined => {
    switch (field) {
      case 'title':
        if (!value || value.trim().length === 0) {
          return 'Meeting title is required';
        }
        if (value.trim().length < 3) {
          return 'Meeting title must be at least 3 characters long';
        }
        if (value.trim().length > 100) {
          return 'Meeting title must be less than 100 characters';
        }
        break;

      case 'startTime':
        if (!value) {
          return 'Start time is required';
        }
        if (isBefore(value, new Date())) {
          return 'Start time cannot be in the past';
        }
        break;

      case 'endTime':
        if (!value) {
          return 'End time is required';
        }
        if (startTime && isBefore(value, startTime)) {
          return 'End time must be after start time';
        }
        if (isBefore(value, new Date())) {
          return 'End time cannot be in the past';
        }
        break;

      case 'description':
        if (value && value.trim().length > 500) {
          return 'Description must be less than 500 characters';
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    errors.title = validateField('title', title);
    errors.startTime = validateField('startTime', startTime);
    errors.endTime = validateField('endTime', endTime);
    errors.description = validateField('description', description);

    // Additional validation for end time vs start time
    if (startTime && endTime && !errors.startTime && !errors.endTime) {
      if (isBefore(endTime, startTime) || isEqual(endTime, startTime)) {
        errors.endTime = 'End time must be after start time';
      }
    }

    setValidationErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some((error) => error !== undefined);
  };

  const handleFieldChange = (field: string, value: any) => {
    // Update the field value
    switch (field) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'startTime':
        setStartTime(value);
        // Re-validate end time when start time changes
        if (touched.endTime) {
          const endTimeError = validateField('endTime', endTime);
          setValidationErrors((prev) => ({ ...prev, endTime: endTimeError }));
        }
        break;
      case 'endTime':
        setEndTime(value);
        break;
    }

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate the field if it's been touched
    if (touched[field]) {
      const error = validateField(field, value);
      setValidationErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Mark all fields as touched
    setTouched({
      title: true,
      startTime: true,
      endTime: true,
      description: true,
    });

    // Validate the entire form
    if (!validateForm()) {
      return;
    }

    // Convert Date objects to ISO strings for the API
    const meetingData: CreateMeeting = {
      title: title.trim(),
      description: description.trim(),
      startTime: startTime!.toISOString(),
      endTime: endTime!.toISOString(),
    };

    console.log('Creating meeting:', meetingData);

    await addMeeting(meetingData);

    // After creating the meeting, refresh the list
    // handleClose();
  };

  const hasErrors = Object.values(validationErrors).some((error) => error !== undefined);

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: {
            xs: '100%', // Mobile: Vollbreite
            sm: '100%', // Small: Vollbreite
            md: 400, // Medium: 400px
            lg: 500, // Large: 400px
            xl: 900, // Extra Large: 400px
          },
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
          padding: {
            xs: '0px 16px 0px 16px', // Mobile: weniger Padding
            sm: '0px 24px 0px 24px', // Small: mittleres Padding
            md: '0px 32px 0px 32px', // Medium und größer: normales Padding
          },
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
            onChange={(e) => handleFieldChange('title', e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
            margin='normal'
            required
            error={touched.title && !!validationErrors.title}
            helperText={touched.title && validationErrors.title}
          />

          <DateTimeRow
            label='Start time'
            value={startTime}
            onChange={(newValue: Date | null) => handleFieldChange('startTime', newValue)}
            required={true}
            error={touched.startTime && !!validationErrors.startTime}
            helperText={touched.startTime ? validationErrors.startTime : undefined}
          />

          <DateTimeRow
            label='End time'
            value={endTime}
            onChange={(newValue: Date | null) => handleFieldChange('endTime', newValue)}
            required={true}
            error={touched.endTime && !!validationErrors.endTime}
            helperText={touched.endTime ? validationErrors.endTime : undefined}
          />

          <TextField
            fullWidth
            label='Description'
            value={description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
            multiline
            minRows={3}
            placeholder='Write any notes regarding the meeting'
            error={touched.description && !!validationErrors.description}
            helperText={touched.description && validationErrors.description}
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
          {error && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          p: { xs: 2, sm: 2.5, md: 3 },
          borderTop: '1px solid lightgrey',
        }}
      >
        <Button variant='outlined' onClick={handleClose} sx={{ flex: 1 }}>
          Cancel
        </Button>
        <Button
          type='submit'
          variant='contained'
          sx={{ flex: 1 }}
          onClick={handleSubmit}
          disabled={loading || hasErrors}
        >
          Save
        </Button>
      </Box>
    </Drawer>
  );
};

export default CreateMeetingDrawer;
