import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

interface SidebarProps {
  history: { word: string; correct: boolean; timeTaken: number }[];
}

export default function Sidebar({ history }: SidebarProps) {
  return (
    <Box
      sx={{
        width: 280,
        bgcolor: "#222d24",
        p: 2,
        color: "#7ccb87",
        height: "calc(100vh - 60px)",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" mb={2} fontWeight={700}>
        Lịch sử học từ
      </Typography>
      <List dense>
        {history.length === 0 && (
          <Typography variant="body2" color="#777" textAlign="center">
            Chưa có kết quả
          </Typography>
        )}
        {history.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              borderBottom: "1px solid #39b36a55",
            }}
          >
            <ListItemText
              primary={`${item.word} - ${item.correct ? "✅" : "❌"} - ${
                item.timeTaken
              }s`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
