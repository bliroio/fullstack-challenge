"use client";

import { SnackbarProvider, closeSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={5000}
      action={(snackbarKey) => (
        <IconButton
          size="small"
          color="inherit"
          onClick={() => closeSnackbar(snackbarKey)}
          sx={{ color: 'inherit' }}
        >
          <Close fontSize="small" />
        </IconButton>
      )}
    >
      {children}
    </SnackbarProvider>
  );
}