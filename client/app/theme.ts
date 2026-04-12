import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#F26835",
      light: "#F5945B",
      dark: "#C84A1A",
    },
    secondary: {
      main: "#000000",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: {
      color: "#131A26",
      fontSize: "24px",
      lineHeight: "36px",
      fontWeight: 600,
    },
    h5: {
      color: "#424852",
      fontSize: "16px",
      lineHeight: "24px",
      fontWeight: 400,
    },
    h6: {
      fontSize: "11px",
      lineHeight: "16px",
      color: "#71767D",
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          height: "40px",
          textTransform: "none",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: "0",
          minHeight: "0",
          height: "64px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: "64px",
          backgroundColor: "#ffffff",
          color: "#2c3e50",
          boxShadow: "none",
          padding: "0",
          borderBottom: "1px solid #E7E8E9",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: "40px",
          "&.MuiInputBase-adornedEnd": {
            height: "auto",
          },
        },
      },
    },
  },
});

export default theme;
