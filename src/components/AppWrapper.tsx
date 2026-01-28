// AppWrapper.tsx
import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline, Switch, Box } from "@mui/material";
import App from "../App";

export default function AppWrapper() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
        primary: { main: "#43e97b" },
        background: {
          default: darkMode ? "#191f1e" : "#fff"
        }
      }
    }), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 1, textAlign: "right" }}>
        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
      </Box>
      <App />
    </ThemeProvider>
  );
}
