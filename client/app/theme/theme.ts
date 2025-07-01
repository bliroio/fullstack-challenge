// theme.ts or theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F26835', // your primary color
    },
    secondary: {
      main: '#9c27b0', // your secondary color
    },
    action: {
      active: '#1976d2',
      hover: '#115293',
      selected: '#0d47a1',
      disabled: '#bdbdbd',
      disabledBackground: '#e0e0e0',
    },
  },
  typography: {
    h5: {
      fontWeight: 600,
      marginBottom: '8px',
    },
    subtitle1: {
      fontSize: '0.875rem',
      color: '#666666',
      fontWeight: 400,
      lineHeight: 1.3,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '4px',
          fontWeight: 600,
          padding: '6px 24px',
        },
        contained: {
          backgroundColor: '#F26835',
          color: '#ffffff',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#e55a2b',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: 'lightgrey',
          color: 'black',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#fafafa',
          margin: 0,
          padding: 0,
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          // Basisstil für das Label
          color: '#343a40',
          fontWeight: 600,
          fontSize: '0.85rem',
          position: 'relative',
          transform: 'none',
          marginBottom: 1,

          // Stil für das Label, wenn es sich im "shrink"-Zustand befindet (wird global über defaultProps gesetzt)
          '&.MuiInputLabel-shrink': {
            transform: 'none',
            position: 'relative',
          },
          // Stil für das Label, wenn es sich im Fokus befindet
          '&.Mui-focused': {
            color: '#343a40',
          },
          // Stil für das Label, wenn es eine Fehlermeldung anzeigt
          '&.Mui-error': {
            color: '#d32f2f',
          },
        },
        asterisk: {
          color: '#dc3545',
        },
      },
      // Hier setzen wir die defaultProps für MuiInputLabel
      defaultProps: {
        shrink: true,
        disableAnimation: true,
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderRadius: '4px',
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#dc3545',
          },
          '& fieldset': {
            borderColor: '#dee2e6',
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: 'black',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'black',
            borderWidth: '1px',
          },
          // Explizit die Primary-Farbe für den Fokus-Zustand überschreiben
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black',
            borderWidth: '1px',
          },
        },
        input: {
          padding: '12px 14px',
          color: '#212529',
          '&::placeholder': {
            color: '#6c757d',
            opacity: 1,
          },
        },
      },
      // Hier setzen wir die defaultProps für MuiOutlinedInput
      defaultProps: {
        notched: false,
      },
    },
  },
});

export default theme;
