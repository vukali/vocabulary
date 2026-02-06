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
import { categories } from "./data/vocab";

const vocabData = {
  all: [
    {
      "word": "hello",
      "meaning": "xin chào",
      "phonetic": "/həˈləʊ/",
      "audio": "https://example.com/hello.mp3"
    },
    {
      "word": "world",
      "meaning": "thế giới",
      "phonetic": "/wɜːld/",
      "audio": "https://example.com/world.mp3"
    },
    {
      "word": "computer",
      "meaning": "máy tính",
      "phonetic": "/kəmˈpjuːtər/",
      "audio": "https://example.com/computer.mp3"
    },
    {
      "word": "book",
      "meaning": "sách",
      "phonetic": "/bʊk/",
      "audio": "https://example.com/book.mp3"
    },
    {
      "word": "student",
      "meaning": "học sinh",
      "phonetic": "/ˈstjuːdənt/",
      "audio": "https://example.com/student.mp3"
    },
    {
      "word": "teacher",
      "meaning": "giáo viên",
      "phonetic": "/ˈtiːtʃər/",
      "audio": "https://example.com/teacher.mp3"
    },
    {
      "word": "friend",
      "meaning": "bạn bè",
      "phonetic": "/frend/",
      "audio": "https://example.com/friend.mp3"
    },
    {
      "word": "family",
      "meaning": "gia đình",
      "phonetic": "/ˈfæməli/",
      "audio": "https://example.com/family.mp3"
    },
    {
      "word": "house",
      "meaning": "ngôi nhà",
      "phonetic": "/haʊs/",
      "audio": "https://example.com/house.mp3"
    },
    {
      "word": "school",
      "meaning": "trường học",
      "phonetic": "/skuːl/",
      "audio": "https://example.com/school.mp3"
    }
  ],
  advanced: [],
  communication: [],
  it: []
};
console.log('vocabData:', vocabData);
import Flashcard from "./components/Flashcard";
import QuizForm from "./components/QuizForm";
import { loadSrsState, saveSrsState, getNextCardWord, applyReview, getProgressSummary, makeCardId } from "./utils/srs";

// Register Chart.js components
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

// Animation variants
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function App() {
  console.log('App rendering');
  // Theme state
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#1976d2",
          },
          secondary: {
            main: "#dc004e",
          },
        },
      }),
    [mode]
  );

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
  const [currentWord, setCurrentWord] = useState({ word: "hello", meaning: "xin chào", phonetic: "/həˈləʊ/", audio: "" });
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

    // Update stats
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

    // Save history
    setHistory(prev => [...prev, {
      word: currentWord.word,
      meaning: currentWord.meaning,
      mode: studyMode,
      correct: isCorrect,
      timeTaken,
      date: today
    }]);

    // Next word
    const nextWord = pickNextWord(next);
    setCurrentWord(nextWord);
    setStartTime(Date.now());
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

  // Chart data
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

  // Load SRS + pick initial word when category changes
  useEffect(() => {
    console.log('category:', category);
    console.log('Loading SRS for category:', category);
    const loaded = loadSrsState(category);
    console.log('Loaded SRS state:', loaded);
    setSrsState(loaded);
    console.log('filteredVocab:', filteredVocab);
    setSrsMeta(getProgressSummary(category, filteredVocab, loaded));
    const first = pickNextWord(loaded);
    console.log('Picked first word:', first);
    setCurrentWord(first);
  }, [category]);

  // Stats
  const difficultWordsCount = srsMeta.due;
  const masteredWordsCount = srsMeta.mastered;
  const totalWordsCount = srsMeta.total || filteredVocab.length;
  const currentCard = currentWord?.word ? srsState[makeCardId(category, currentWord.word)] : null;

  return (
    <div style={{ color: 'black', background: 'white', padding: '20px' }}>
      <h1>Vocabulary App</h1>
      <p>Current word: {currentWord ? currentWord.word : 'None'}</p>
      <p>Category: {category}</p>
      <p>Filtered vocab length: {filteredVocab.length}</p>
    </div>
  );
}

export default App;

