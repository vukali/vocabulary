import React from "react";
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

interface SidebarStageItem {
  key: string;
  label: string;
  helper: string;
  icon: React.ReactNode;
  subItems: Array<{
    key: string;
    label: string;
    emoji?: string;
  }>;
}

interface SidebarStat {
  label: string;
  value: string;
}

interface SidebarProps {
  locale: string;
  mode: string;
  title: string;
  subtitle: string;
  stageItems: SidebarStageItem[];
  activeStage: string;
  activeCategory: string;
  onStageChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  stats: SidebarStat[];
  history: { word: string; correct: boolean; timeTaken: number }[];
  onOpenInsights: () => void;
  onOpenProfile: () => void;
}

const copy = {
  vi: {
    menu: "Lộ trình học",
    submenu: "Bộ học trong module này",
    recent: "Vừa học xong",
    empty: "Chưa có lịch sử. Làm vài thẻ đầu để sidebar bắt đầu hữu ích.",
    progress: "Tiến độ",
    setup: "Nhịp học",
  },
  en: {
    menu: "Learning flow",
    submenu: "Decks in this module",
    recent: "Recent cards",
    empty: "No history yet. Complete a few cards to make this sidebar useful.",
    progress: "Progress",
    setup: "Learning setup",
  },
};

export default function Sidebar({
  locale,
  mode,
  title,
  subtitle,
  stageItems,
  activeStage,
  activeCategory,
  onStageChange,
  onCategoryChange,
  stats,
  history,
  onOpenInsights,
  onOpenProfile,
}: SidebarProps) {
  const t = copy[locale as "vi" | "en"] || copy.vi;
  const isDark = mode === "dark";

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        p: 1.35,
        borderRadius: 4,
        maxHeight: "100%",
        overflow: "hidden",
        color: "#f6f5f0",
        background: isDark
          ? "linear-gradient(180deg, rgba(16, 25, 23, 0.98), rgba(10, 16, 15, 0.98))"
          : "linear-gradient(180deg, rgba(24, 55, 48, 0.98), rgba(18, 39, 35, 0.98))",
        border: `1px solid ${alpha("#ffffff", 0.1)}`,
        boxShadow: isDark ? "0 12px 28px rgba(0,0,0,0.24)" : "0 12px 28px rgba(25, 50, 43, 0.2)",
      }}
    >
      <Box
        sx={{
          px: 1,
          py: 0.6,
          borderRadius: 3,
          background: alpha("#ffffff", 0.05),
          border: `1px solid ${alpha("#ffffff", 0.08)}`,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#f8f4ec" }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 0.4, color: alpha("#f8f4ec", 0.74), lineHeight: 1.5 }}
        >
          {subtitle}
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          p: 1.15,
          bgcolor: alpha("#ffffff", 0.06),
          border: `1px solid ${alpha("#ffffff", 0.08)}`,
        }}
      >
        <Stack spacing={0.9}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 0.85,
            }}
          >
            {stats.map((item) => (
              <Box
                key={item.label}
                sx={{
                  borderRadius: 4,
                  p: 1,
                  bgcolor: alpha("#ffffff", 0.05),
                  border: `1px solid ${alpha("#ffffff", 0.06)}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: alpha("#f8f4ec", 0.7) }}
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{ mt: 0.15, fontWeight: 800, color: "#fff9f1" }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              size="small"
              variant="contained"
              onClick={onOpenInsights}
              sx={{
                borderRadius: 999,
                background: "linear-gradient(135deg, #e3b56a, #c8872a)",
                color: "#1e251f",
              }}
            >
              {t.progress}
            </Button>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              onClick={onOpenProfile}
              sx={{
                borderRadius: 999,
                color: "#f5efe4",
                borderColor: alpha("#ffffff", 0.2),
              }}
            >
              {t.setup}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: "auto", pr: 0.15 }}>
        <Typography
          variant="overline"
          sx={{ px: 1, color: alpha("#f8f4ec", 0.72), letterSpacing: "0.08em" }}
        >
          {t.menu}
        </Typography>

        <List disablePadding sx={{ mt: 0.45 }}>
          {stageItems.map((item) => {
            const selected = item.key === activeStage;

            return (
              <Box key={item.key} sx={{ mb: 0.7 }}>
                <ListItemButton
                  onClick={() => onStageChange(item.key)}
                  selected={selected}
                  sx={{
                    borderRadius: 4,
                    alignItems: "flex-start",
                    px: 1.1,
                    py: 1,
                    color: alpha("#f8f4ec", selected ? 1 : 0.82),
                    border: `1px solid ${
                      selected ? alpha("#7de0b7", 0.28) : alpha("#ffffff", 0.04)
                    }`,
                    bgcolor: selected ? alpha("#7de0b7", 0.12) : "transparent",
                    "&:hover": {
                      bgcolor: selected
                        ? alpha("#7de0b7", 0.16)
                        : alpha("#ffffff", 0.05),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: 36, color: "inherit", pt: 0.15 }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    secondary={item.helper}
                    primaryTypographyProps={{
                      fontWeight: 700,
                      fontSize: "0.98rem",
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        mt: 0.25,
                        color: alpha("#f8f4ec", 0.62),
                        lineHeight: 1.45,
                      },
                    }}
                  />
                </ListItemButton>

                {selected && item.subItems.length > 0 && (
                  <Box sx={{ pl: 5, pr: 0.5, pt: 0.85 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: alpha("#f8f4ec", 0.58) }}
                    >
                      {t.submenu}
                    </Typography>

                    <Stack spacing={0.45} sx={{ mt: 0.7 }}>
                      {item.subItems.map((sub) => {
                        const subSelected = sub.key === activeCategory;

                        return (
                          <Button
                            key={sub.key}
                            onClick={() => onCategoryChange(sub.key)}
                            variant={subSelected ? "contained" : "text"}
                            size="small"
                            endIcon={<ChevronRightRoundedIcon />}
                            sx={{
                              justifyContent: "space-between",
                              px: 1,
                              py: 0.8,
                              borderRadius: 3,
                              textAlign: "left",
                              background: subSelected
                                ? "linear-gradient(135deg, #2f8a77, #4fb59e)"
                                : "transparent",
                              color: subSelected
                                ? "#fffaf2"
                                : alpha("#f8f4ec", 0.82),
                              "&:hover": {
                                bgcolor: subSelected
                                  ? undefined
                                  : alpha("#ffffff", 0.05),
                              },
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.85,
                                width: "100%",
                              }}
                            >
                              <Box component="span">{sub.emoji || "•"}</Box>
                              <Box
                                component="span"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  /* allow wrapping on small screens to avoid overflow */
                                  whiteSpace: { xs: "normal", sm: "nowrap" },
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {sub.label}
                              </Box>
                            </Box>
                          </Button>
                        );
                      })}
                    </Stack>
                  </Box>
                )}
              </Box>
            );
          })}
        </List>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          p: 1.1,
          bgcolor: alpha("#ffffff", 0.05),
          border: `1px solid ${alpha("#ffffff", 0.08)}`,
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: alpha("#f8f4ec", 0.74), letterSpacing: "0.08em" }}
        >
          {t.recent}
        </Typography>

        <Stack spacing={0.75} sx={{ mt: 0.65 }}>
          {history.length === 0 ? (
            <Typography variant="body2" sx={{ color: alpha("#f8f4ec", 0.6) }}>
              {t.empty}
            </Typography>
          ) : (
            history.slice(0, 4).map((item, index) => (
              <Box
                key={`${item.word}-${index}`}
                sx={{
                  borderRadius: 3,
                  px: 1,
                  py: 0.8,
                  bgcolor: alpha("#ffffff", 0.04),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff8ef",
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.word}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: item.correct ? "#93efc4" : "#ffd08a",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {item.timeTaken}s
                </Typography>
              </Box>
            ))
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
