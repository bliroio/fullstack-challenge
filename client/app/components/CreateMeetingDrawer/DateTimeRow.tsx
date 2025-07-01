'use client';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { de } from 'date-fns/locale';
import Box from '@mui/material/Box';
import React from 'react';

interface DateTimeRowProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  required?: boolean;
}

// Global slots configuration to remove icons from date/time pickers
const datePickerSlots = {
  openPickerIcon: () => null,
};

const DateTimeRow: React.FC<DateTimeRowProps> = ({ label, value, onChange, required = true }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-end' }}>
        <Box sx={{ flex: 2 }}>
          <DatePicker
            label={label}
            value={value}
            onChange={onChange}
            slots={datePickerSlots}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
                required,
              },
            }}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <TimePicker
            label=''
            value={value}
            onChange={onChange}
            slots={datePickerSlots}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
                required,
                InputLabelProps: {
                  required: false,
                },
              },
            }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default DateTimeRow;
