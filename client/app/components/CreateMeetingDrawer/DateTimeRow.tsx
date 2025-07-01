'use client';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { de } from 'date-fns/locale';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import React from 'react';

interface DateTimeRowProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

// Global slots configuration to remove icons from date/time pickers
const datePickerSlots = {
  openPickerIcon: () => null,
};

const DateTimeRow: React.FC<DateTimeRowProps> = ({
  label,
  value,
  onChange,
  required = true,
  error = false,
  helperText,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
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
                  error,
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
                  error,
                  InputLabelProps: {
                    required: false,
                  },
                },
              }}
            />
          </Box>
        </Box>
        {helperText && (
          <FormHelperText
            error={error}
            sx={{
              mt: 0.5,
              ml: 1.5,
              fontSize: '0.75rem',
              lineHeight: 1.66,
              letterSpacing: '0.03333em',
            }}
          >
            {helperText}
          </FormHelperText>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default DateTimeRow;
