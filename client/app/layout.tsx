"use client";

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F26835',
      light: '#F26835',
      dark: '#F26835',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: {
      color: '#131A26',
      fontSize: '24px',
      lineHeight: '36px',
      fontWeight: 600,
    },
    h6: {
      fontSize: '11px',
      lineHeight: '16px',
      color: '#71767D',
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          height: '40px',
          textTransform: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: '0',
          minHeight: '0',
          height: '64px'
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: '64px',
          backgroundColor: '#ffffff',
          color: '#2c3e50',
          boxShadow: 'none',
          padding: '0',
          borderBottom: '1px solid #E7E8E9',
        },
      },
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
