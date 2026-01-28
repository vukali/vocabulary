import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme as useMuiTheme,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  DonutLarge as DonutLargeIcon,
  Notifications as NotificationsIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import Flashcard from "./components/Flashcard";
import QuizForm from "./components/QuizForm";
import { vocabData, categories } from './data/vocab';
import {
  applyReview,
  getNextCardWord,
  getProgressSummary,
  loadSrsState,
  makeCardId,
  saveSrsState,
} from "./utils/srs";

// Đăng ký các components của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Theme configuration
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Animation variants
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Styles
const getStyles = (theme) => ({
  appBar: {
    bgcolor: theme.palette.mode === "dark" ? "#222d24" : "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categorySelect: {
    bgcolor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
    borderRadius: 1,
    minWidth: 150,
    transition: "background-color 0.3s",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.mode === "dark" ? "#555" : "#ddd",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#43e97b",
    },
    "& .MuiSvgIcon-root": {
      color: "#43e97b",
    },
  },
  container: {
    minHeight: "calc(100vh - 128px)",
    bgcolor: theme.palette.mode === "dark" ? "#191f1e" : "#f8f9fa",
    mt: 3,
    mb: 3,
    borderRadius: 2,
    p: { xs: 2, sm: 3, md: 4 },
    display: "flex",
    gap: { xs: 3, md: 6 },
    flexWrap: "wrap",
    flexDirection: { xs: "column", md: "row" },
    justifyContent: "center",
    alignItems: "flex-start",
    transition: "background-color 0.3s",
  },
  mainContent: {
    display: "flex",
    gap: { xs: 3, md: 6 },
    alignItems: "center",
    maxWidth: { xs: "100%", md: "60vw" },
    flex: "1 1 600px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  statsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    width: { xs: "100%", md: "300px" },
  },
  paper: {
    p: { xs: 2, sm: 3 },
    bgcolor: theme.palette.mode === "dark" ? "#222d24" : "#fff",
    borderRadius: 2,
    color: theme.palette.mode === "dark" ? "#fff" : "#333",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    transition: "all 0.3s",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
    },
  },
  chartContainer: {
    height: { xs: 150, sm: 200 },
    position: "relative",
  },
  goalDialog: {
    "& .MuiDialog-paper": {
      bgcolor: theme.palette.mode === "dark" ? "#222d24" : "#fff",
      color: theme.palette.mode === "dark" ? "#fff" : "#333",
      borderRadius: 2,
      transition: "background-color 0.3s",
    },
  },
  goalTextField: {
    "& .MuiOutlinedInput-root": {
      color: theme.palette.mode === "dark" ? "#fff" : "#333",
      "& fieldset": {
        borderColor: theme.palette.mode === "dark" ? "#555" : "#ddd",
      },
      "&:hover fieldset": {
        borderColor: "#43e97b",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#43e97b",
      },
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.mode === "dark" ? "#c3ffe1" : "#666",
    },
  },
  themeSwitch: {
    color: theme.palette.mode === "dark" ? "#fff" : "#333",
    transition: "color 0.3s",
  },
});

function App() {
  // Theme state
  const [mode, setMode] = useState("light");
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#43e97b",
      },
      background: {
        default: mode === "dark" ? "#191f1e" : "#f8f9fa",
        paper: mode === "dark" ? "#222d24" : "#fff",
      },
    },
  });
  const styles = getStyles(theme);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // App states
  const [category, setCategory] = useState("all");
  const [showDetail, setShowDetail] = useState(false);
  const [history, setHistory] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [stats, setStats] = useState({
    totalWords: 0,
    correctAnswers: 0,
    averageTime: 0,
    dailyProgress: [],
    enToVi: { total: 0, correct: 0 },
    viToEn: { total: 0, correct: 0 }
  });
  const [goals, setGoals] = useState({
    dailyWords: 0,
    dailyAccuracy: 0,
    reminderTime: "",
  });
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [studyMode, setStudyMode] = useState("en-to-vi");
  const [currentWord, setCurrentWord] = useState(null);
  const [srsState, setSrsState] = useState({});
  const [srsMeta, setSrsMeta] = useState({ total: 0, learned: 0, mastered: 0, due: 0 });

  // Load theme preference
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const savedStats = localStorage.getItem("vocabStats");
      const savedHistory = localStorage.getItem("vocabHistory");
      const savedGoals = localStorage.getItem("vocabGoals");

      if (savedStats) setStats(JSON.parse(savedStats));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    };

    loadData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const saveData = () => {
      localStorage.setItem("vocabStats", JSON.stringify(stats));
      localStorage.setItem("vocabHistory", JSON.stringify(history));
      localStorage.setItem("vocabGoals", JSON.stringify(goals));
    };

    saveData();
  }, [stats, history, goals]);

  // Get filtered vocabulary based on category
  const filteredVocab = useMemo(() => {
    return vocabData[category] || [];
  }, [category]);

  const pickNextWord = useCallback((nextState = srsState) => {
    const { chosen, reason } = getNextCardWord(category, filteredVocab, nextState);
    if (!chosen) return null;
    const mode = Math.random() < 0.5 ? "en-to-vi" : "vi-to-en";
    setStudyMode(mode);
    if (reason === "due") {
      setNotificationMessage("Review time! This word is due.");
      setShowNotification(true);
    }
    return { ...chosen, mode };
  }, [category, filteredVocab, srsState]);

  // Reset start time when word changes
  useEffect(() => {
    setStartTime(Date.now());
  }, [currentWord]);

  // Handle answer
  const handleAnswer = useCallback((isCorrect) => {
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000);
    const today = new Date().toISOString().split("T")[0];

    // Update SRS state for the current word
    const next = { ...(srsState || {}) };
    if (currentWord?.word) {
      const id = makeCardId(category, currentWord.word);
      applyReview(next, id, isCorrect);
      saveSrsState(category, next);
      setSrsState(next);
      setSrsMeta(getProgressSummary(category, filteredVocab, next));
    }

    // Cập nhật thống kê
    setStats(prev => {
      const newStats = { ...prev };
      newStats.totalWords += 1;
      newStats.correctAnswers += isCorrect ? 1 : 0;

      if (studyMode === "en-to-vi") {
        newStats.enToVi.total += 1;
        newStats.enToVi.correct += isCorrect ? 1 : 0;
      } else {
        newStats.viToEn.total += 1;
        newStats.viToEn.correct += isCorrect ? 1 : 0;
      }

      newStats.averageTime = (prev.averageTime * prev.totalWords + timeTaken) / (prev.totalWords + 1);

      const dailyProgress = [...prev.dailyProgress];
      const todayIndex = dailyProgress.findIndex(day => day.date === today);

      if (todayIndex === -1) {
        dailyProgress.push({
          date: today,
          words: 1,
          correct: isCorrect ? 1 : 0,
          time: timeTaken,
          enToVi: { total: studyMode === "en-to-vi" ? 1 : 0, correct: studyMode === "en-to-vi" && isCorrect ? 1 : 0 },
          viToEn: { total: studyMode === "vi-to-en" ? 1 : 0, correct: studyMode === "vi-to-en" && isCorrect ? 1 : 0 }
        });
      } else {
        const todayStats = dailyProgress[todayIndex];
        dailyProgress[todayIndex] = {
          ...todayStats,
          words: todayStats.words + 1,
          correct: todayStats.correct + (isCorrect ? 1 : 0),
          time: todayStats.time + timeTaken,
          enToVi: {
            total: todayStats.enToVi.total + (studyMode === "en-to-vi" ? 1 : 0),
            correct: todayStats.enToVi.correct + (studyMode === "en-to-vi" && isCorrect ? 1 : 0)
          },
          viToEn: {
            total: todayStats.viToEn.total + (studyMode === "vi-to-en" ? 1 : 0),
            correct: todayStats.viToEn.correct + (studyMode === "vi-to-en" && isCorrect ? 1 : 0)
          }
        };
      }

      newStats.dailyProgress = dailyProgress;
      return newStats;
    });

    // Lưu lịch sử
    setHistory(prev => [...prev, {
      word: currentWord.word,
      meaning: currentWord.meaning,
      mode: studyMode,
      correct: isCorrect,
      timeTaken,
      date: today
    }]);

    // Chuyển sang từ tiếp theo
    const nextWord = pickNextWord(next);
    setCurrentWord(nextWord);
    setStartTime(Date.now()); // Reset thời gian bắt đầu cho từ mới
  }, [category, currentWord, filteredVocab, pickNextWord, srsState, startTime, studyMode]);

  // Handle show detail
  const handleShowDetail = useCallback(() => {
    setShowDetail(true);
  }, []);

  // Handle set goals
  const handleSetGoals = useCallback((newGoals) => {
    setGoals(newGoals);
    setShowGoalDialog(false);
    setNotificationMessage("Learning goals have been updated!");
    setShowNotification(true);
  }, []);

  // Prepare chart data
  const lineChartData = {
    labels: stats.dailyProgress.slice(-7).map(day => day.date),
    datasets: [
      {
        label: "English -> Vietnamese",
        data: stats.dailyProgress.slice(-7).map(day => day.enToVi.correct),
        borderColor: "#43e97b",
        tension: 0.4,
      },
      {
        label: "Vietnamese -> English",
        data: stats.dailyProgress.slice(-7).map(day => day.viToEn.correct),
        borderColor: "#4facfe",
        tension: 0.4,
      }
    ],
  };

  const doughnutChartData = {
    labels: ["English -> Vietnamese", "Vietnamese -> English"],
    datasets: [
      {
        data: [
          stats.enToVi.correct,
          stats.viToEn.correct
        ],
        backgroundColor: ["#43e97b", "#4facfe"],
      },
    ],
  };

  // Load SRS + pick an initial word when category changes
  useEffect(() => {
    const loaded = loadSrsState(category);
    setSrsState(loaded);
    setSrsMeta(getProgressSummary(category, filteredVocab, loaded));
    const first = pickNextWord(loaded);
    setCurrentWord(first);
  }, [category]);

  // Add statistics for difficult words
  const difficultWordsCount = srsMeta.due;
  const masteredWordsCount = srsMeta.mastered;
  const totalWordsCount = srsMeta.total || filteredVocab.length;
  const currentCard = currentWord?.word ? srsState[makeCardId(category, currentWord.word)] : null;

  return (
    <MuiThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Vocabulary App
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.key} value={cat.key}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")}>
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentWord?.word}
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                  >
                    <Flashcard
                      word={studyMode === "en-to-vi" ? currentWord?.word : currentWord?.meaning}
                      phonetic={currentWord?.phonetic}
                      audio={currentWord?.audio}
                      showDetail={showDetail}
                      meta={{ level: currentCard?.level ?? 0, dueAt: currentCard?.dueAt }}
                    />
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <QuizForm
                    question={studyMode === "en-to-vi" ? currentWord?.word : currentWord?.meaning}
                    answer={studyMode === "en-to-vi" ? currentWord?.meaning : currentWord?.word}
                    label={studyMode === "en-to-vi" ? "Enter Vietnamese meaning" : "Enter English word"}
                    onNext={handleAnswer}
                    onShowDetail={handleShowDetail}
                  />
                </motion.div>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Learning Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Total Words:</Typography>
                      <Typography variant="h4">{stats.totalWords}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Correct:</Typography>
                      <Typography variant="h4">{stats.correctAnswers}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">English -&gt; Vietnamese:</Typography>
                      <Typography variant="h4">
                        {stats.enToVi.correct}/{stats.enToVi.total}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Vietnamese -&gt; English:</Typography>
                      <Typography variant="h4">
                        {stats.viToEn.correct}/{stats.viToEn.total}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Average Time:</Typography>
                      <Typography variant="h4">{stats.averageTime.toFixed(1)}s</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2">Mastered Words:</Typography>
                      <Typography variant="h4">{masteredWordsCount}/{totalWordsCount}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2">Difficult Words:</Typography>
                      <Typography variant="h4">{difficultWordsCount}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2">Progress:</Typography>
                      <Typography variant="h4">
                        {Math.round((masteredWordsCount / totalWordsCount) * 100)}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Learning Progress
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    <Line
                      data={lineChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Correct/Incorrect Ratio
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    <Doughnut
                      data={doughnutChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Dialog open={showGoalDialog} onClose={() => setShowGoalDialog(false)}>
          <DialogTitle>Set Learning Goals</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
              <TextField
                label="Words per day"
                type="number"
                value={goals.dailyWords}
                onChange={(e) => setGoals({ ...goals, dailyWords: parseInt(e.target.value) || 0 })}
              />
              <TextField
                label="Accuracy (%)"
                type="number"
                value={goals.dailyAccuracy}
                onChange={(e) => setGoals({ ...goals, dailyAccuracy: parseInt(e.target.value) || 0 })}
              />
              <TextField
                label="Reminder Time"
                type="time"
                value={goals.reminderTime}
                onChange={(e) => setGoals({ ...goals, reminderTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowGoalDialog(false)}>Cancel</Button>
            <Button onClick={() => handleSetGoals(goals)} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={showNotification}
          autoHideDuration={6000}
          onClose={() => setShowNotification(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowNotification(false)}
            severity="info"
            sx={{ width: "100%" }}
          >
            {notificationMessage}
          </Alert>
        </Snackbar>
      </Box>
    </MuiThemeProvider>
  );
}

export default App;

