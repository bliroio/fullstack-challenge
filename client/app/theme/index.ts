'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#131A26',
    },
    grey: {
      [100]: '#E7E8E9',
      [200]: '#D0D1D4',
      [300]: '#71767D',
    }
  },
});
