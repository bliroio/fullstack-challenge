"use client";

import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeRegistry from "./ThemeRegistry";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        {children}
      </LocalizationProvider>
    </ThemeRegistry>
  );
}
