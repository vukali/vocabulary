import React from "react";
import { Box } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        height: 50,
        bgcolor: "#111",
        color: "#4caf50",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
      }}
    >
      © 2025 Vocab App. All rights reserved.
    </Box>
  );
}
