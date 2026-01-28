import React from "react";
import { Box } from "@mui/material";

export default function Header() {
  return (
    <Box
      sx={{
        height: 60,
        bgcolor: "#111",
        color: "#4caf50",
        display: "flex",
        alignItems: "center",
        px: 3,
        fontWeight: "bold",
        fontSize: 24,
      }}
    >
      Vocab Learning App
    </Box>
  );
}
