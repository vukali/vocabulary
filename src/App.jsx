<<<<<<< HEAD
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

=======
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
  alpha,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  AutoStoriesRounded,
  Brightness4,
  Brightness7,
  CampaignRounded,
  ForumRounded,
  GraphicEqRounded,
  HistoryEduRounded,
  Insights,
  Tune,
} from "@mui/icons-material";
import Flashcard from "./components/Flashcard";
import QuizForm from "./components/QuizForm";
import { categories, vocabData } from "./data/vocab";
import { posLabels, stageCopy, uiCopy } from "./data/uiCopy";
import {
  applyReview,
  getNextCardWord,
  getProgressSummary,
  loadSrsState,
  makeCardId,
  saveSrsState,
} from "./utils/srs";

const PROFILE_KEY = "vocabLearnerProfile";
const GOALS_KEY = "vocabGoals";
const STATS_KEY = "vocabStats";
const HISTORY_KEY = "vocabHistory";
const THEME_KEY = "themeMode";
const STAGE_KEY = "learningStage";
const LOCALE_KEY = "uiLocale";
const CATEGORY_KEY = "activeDeck";

const STAGES = ["vocabulary", "phrases", "tenses", "shadowing", "speaking"];
const DEFAULT_PROFILE = {
  dailyMinutes: "10",
  focusPain: "forget",
  memoryStyle: "type",
  preferredTrack: "communication",
};
const DEFAULT_GOALS = { dailyWords: 14, dailyAccuracy: 85 };
const EMPTY_STATS = {
  totalWords: 0,
  correctAnswers: 0,
  averageTime: 0,
  dailyProgress: [],
  enToVi: { total: 0, correct: 0 },
  viToEn: { total: 0, correct: 0 },
};

const panelCopy = {
  vi: {
    currentSession: "Phiên học hiện tại",
    responsePanel: "Trả lời ngay",
    responseHelper:
      "Nhìn thẻ bên trái rồi gõ hoặc nói ở đây. Trên màn hình lớn, câu hỏi và kết quả sẽ nằm cùng một khung nhìn.",
    direction: "Hướng nhớ",
    openMenu: "Mở menu",
  },
  en: {
    currentSession: "Current session",
    responsePanel: "Respond now",
    responseHelper:
      "Look at the card on the left, then type or speak here. On large screens the prompt and result stay in the same viewport.",
    direction: "Recall direction",
    openMenu: "Open menu",
  },
};

const stageIcons = {
  vocabulary: <AutoStoriesRounded fontSize="small" />,
  phrases: <ForumRounded fontSize="small" />,
  tenses: <HistoryEduRounded fontSize="small" />,
  shadowing: <GraphicEqRounded fontSize="small" />,
  speaking: <CampaignRounded fontSize="small" />,
};

const readJson = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const readText = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) || fallback;
};

const todayKey = () => new Date().toISOString().split("T")[0];
const accuracy = (correct, total) => (total ? Math.round((correct / total) * 100) : 0);
const getLocalized = (value, locale) => value?.[locale] ?? value?.vi ?? value ?? "";
const getAllowedCategories = (stage) => {
  if (stage === "vocabulary") return categories.filter((item) => item.section === "vocabulary");
  if (stage === "tenses") return categories.filter((item) => item.section === "grammar");
  return categories.filter((item) => item.section === "phrases");
};
const sanitizeCategory = (stage, maybeCategory, preferredTrack) => {
  const fallback = stage === "vocabulary" ? preferredTrack : stage === "tenses" ? "tenses" : "phrases";
  const allowed = getAllowedCategories(stage);
  return allowed.some((item) => item.key === maybeCategory) ? maybeCategory : fallback;
};
const pickDirection = (stage) => {
  if (stage === "shadowing") return "en-to-vi";
  if (stage === "speaking") return "vi-to-en";
  if (stage === "tenses") return "vi-to-en";
  return Math.random() < 0.5 ? "en-to-vi" : "vi-to-en";
};

function App() {
  const savedProfile = { ...DEFAULT_PROFILE, ...readJson(PROFILE_KEY, {}) };
  const storedStage = readText(STAGE_KEY, "vocabulary");
  const initialStage = STAGES.includes(storedStage) ? storedStage : "vocabulary";
  const initialCategory = sanitizeCategory(
    initialStage,
    readText(CATEGORY_KEY, savedProfile.preferredTrack),
    savedProfile.preferredTrack
  );

  const [mode, setMode] = useState(() => readText(THEME_KEY, "light"));
  const [locale, setLocale] = useState(() => readText(LOCALE_KEY, "vi"));
  const [stage, setStage] = useState(initialStage);
  const [profile, setProfile] = useState(savedProfile);
  const [draftProfile, setDraftProfile] = useState(savedProfile);
  const [goals, setGoals] = useState(() => ({ ...DEFAULT_GOALS, ...readJson(GOALS_KEY, {}) }));
  const [stats, setStats] = useState(() => ({ ...EMPTY_STATS, ...readJson(STATS_KEY, {}) }));
  const [history, setHistory] = useState(() => readJson(HISTORY_KEY, []));
  const [category, setCategory] = useState(initialCategory);
  const [showProfileDialog, setShowProfileDialog] = useState(() => !window.localStorage.getItem(PROFILE_KEY));
  const [showInsightsDialog, setShowInsightsDialog] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [studyMode, setStudyMode] = useState("en-to-vi");
  const [currentWord, setCurrentWord] = useState(null);
  const [srsState, setSrsState] = useState({});
  const [srsMeta, setSrsMeta] = useState({ total: 0, learned: 0, mastered: 0, due: 0 });
  const [startTime, setStartTime] = useState(Date.now());
  const [notification, setNotification] = useState({ open: false, severity: "info", message: "" });

  const copy = uiCopy[locale] || uiCopy.vi;
  const shellCopy = panelCopy[locale] || panelCopy.vi;
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "dark" ? "#7fe4b5" : "#2c6e62" },
          secondary: { main: mode === "dark" ? "#ffc874" : "#c58731" },
          background: {
            default: mode === "dark" ? "#101917" : "#f6efe4",
            paper: mode === "dark" ? "#172420" : "#fffaf2",
          },
          text: {
            primary: mode === "dark" ? "#eff8f3" : "#24342f",
            secondary: mode === "dark" ? "#b7cbc3" : "#6c756c",
          },
        },
        typography: {
          fontFamily: '"Be Vietnam Pro", "Segoe UI", "Trebuchet MS", sans-serif',
          fontSize: 13,
          h3: { fontWeight: 800, fontSize: "2.15rem", letterSpacing: "-0.04em" },
          h4: { fontWeight: 800, fontSize: "1.35rem", letterSpacing: "-0.03em" },
          h6: { fontWeight: 700, fontSize: "1rem" },
          button: { textTransform: "none", fontWeight: 700 },
        },
        shape: { borderRadius: 8 },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 999,
              },
            },
          },
        },
      }),
    [mode]
  );
  const safeCategory = useMemo(
    () => sanitizeCategory(stage, category, profile.preferredTrack),
    [category, profile.preferredTrack, stage]
  );
  const allowedCategories = useMemo(() => getAllowedCategories(stage), [stage]);
  const activeCategory = useMemo(
    () => categories.find((item) => item.key === safeCategory) || categories[0],
    [safeCategory]
  );
  const words = useMemo(() => vocabData[safeCategory] || [], [safeCategory]);
  const todayProgress = useMemo(
    () =>
      stats.dailyProgress.find((entry) => entry.date === todayKey()) || {
        date: todayKey(),
        words: 0,
        correct: 0,
        time: 0,
        enToVi: { total: 0, correct: 0 },
        viToEn: { total: 0, correct: 0 },
      },
    [stats.dailyProgress]
  );
  const answerBundle = useMemo(() => {
    if (!currentWord) return { primary: "", accepted: [], alternatives: [] };
    const primary = studyMode === "en-to-vi" ? currentWord.meaning : currentWord.word;
    const alternatives =
      studyMode === "en-to-vi" ? currentWord.alternativesVi || [] : currentWord.alternativesEn || [];
    return { primary, accepted: [primary, ...alternatives], alternatives };
  }, [currentWord, studyMode]);
  const currentPrompt = currentWord ? (studyMode === "en-to-vi" ? currentWord.word : currentWord.meaning) : "";
  const currentCard = currentWord?.word ? srsState[makeCardId(safeCategory, currentWord.word)] : null;

  const showNotice = useCallback((message, severity = "info") => {
    setNotification({ open: true, severity, message });
  }, []);

  const loadDeck = useCallback((selectedCategory, selectedStage) => {
    const deck = vocabData[selectedCategory] || [];
    const loaded = loadSrsState(selectedCategory);
    const picked = getNextCardWord(selectedCategory, deck, loaded).chosen;
    const direction = pickDirection(selectedStage);
    setSrsState(loaded);
    setSrsMeta(getProgressSummary(selectedCategory, deck, loaded));
    setStudyMode(direction);
    setCurrentWord(picked ? { ...picked, direction } : null);
    setShowDetail(false);
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (category !== safeCategory) setCategory(safeCategory);
  }, [category, safeCategory]);

  useEffect(() => {
    loadDeck(safeCategory, stage);
  }, [loadDeck, safeCategory, stage]);

  useEffect(() => {
    window.localStorage.setItem(THEME_KEY, mode);
    window.localStorage.setItem(LOCALE_KEY, locale);
    window.localStorage.setItem(STAGE_KEY, stage);
    window.localStorage.setItem(CATEGORY_KEY, safeCategory);
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [category, goals, history, locale, mode, profile, safeCategory, stage, stats]);

  useEffect(() => {
    setDraftProfile(profile);
  }, [profile]);

  const handleAnswer = useCallback(
    (isCorrect) => {
      if (!currentWord) return;
      const now = Date.now();
      const timeTaken = Math.max(1, Math.round((now - startTime) / 1000));
      const day = todayKey();
      const nextState = { ...srsState };

      applyReview(nextState, makeCardId(safeCategory, currentWord.word), isCorrect, now);
      saveSrsState(safeCategory, nextState);
      setSrsState(nextState);
      setSrsMeta(getProgressSummary(safeCategory, words, nextState));

      setStats((previous) => {
        const next = {
          ...EMPTY_STATS,
          ...previous,
          enToVi: { ...(previous.enToVi || { total: 0, correct: 0 }) },
          viToEn: { ...(previous.viToEn || { total: 0, correct: 0 }) },
          dailyProgress: [...(previous.dailyProgress || [])],
        };
        next.totalWords += 1;
        next.correctAnswers += isCorrect ? 1 : 0;
        next.averageTime =
          ((previous.averageTime || 0) * (previous.totalWords || 0) + timeTaken) / next.totalWords;
        const bucket = studyMode === "en-to-vi" ? next.enToVi : next.viToEn;
        bucket.total += 1;
        bucket.correct += isCorrect ? 1 : 0;
        const index = next.dailyProgress.findIndex((entry) => entry.date === day);
        if (index === -1) {
          next.dailyProgress.push({
            date: day,
            words: 1,
            correct: isCorrect ? 1 : 0,
            time: timeTaken,
            enToVi: { total: studyMode === "en-to-vi" ? 1 : 0, correct: studyMode === "en-to-vi" && isCorrect ? 1 : 0 },
            viToEn: { total: studyMode === "vi-to-en" ? 1 : 0, correct: studyMode === "vi-to-en" && isCorrect ? 1 : 0 },
          });
        } else {
          const entry = next.dailyProgress[index];
          next.dailyProgress[index] = {
            ...entry,
            words: entry.words + 1,
            correct: entry.correct + (isCorrect ? 1 : 0),
            time: entry.time + timeTaken,
            enToVi: {
              total: entry.enToVi.total + (studyMode === "en-to-vi" ? 1 : 0),
              correct: entry.enToVi.correct + (studyMode === "en-to-vi" && isCorrect ? 1 : 0),
            },
            viToEn: {
              total: entry.viToEn.total + (studyMode === "vi-to-en" ? 1 : 0),
              correct: entry.viToEn.correct + (studyMode === "vi-to-en" && isCorrect ? 1 : 0),
            },
          };
        }
        return next;
      });

      setHistory((previous) =>
        [{ word: currentWord.word, correct: isCorrect, timeTaken, stage }, ...previous].slice(0, 18)
      );

      const nextCard = getNextCardWord(safeCategory, words, nextState).chosen;
      const nextDirection = pickDirection(stage);
      setCurrentWord(nextCard ? { ...nextCard, direction: nextDirection } : null);
      setStudyMode(nextDirection);
      setShowDetail(false);
      setStartTime(Date.now());
      showNotice(isCorrect ? copy.correctToast : copy.wrongToast, isCorrect ? "success" : "warning");
    },
    [copy.correctToast, copy.wrongToast, currentWord, safeCategory, showNotice, srsState, stage, startTime, studyMode, words]
  );

  const handleSaveProfile = useCallback(() => {
    const dailyWords = draftProfile.dailyMinutes === "20" ? 24 : draftProfile.dailyMinutes === "5" ? 8 : 14;
    setProfile(draftProfile);
    setGoals({
      dailyWords: draftProfile.focusPain === "typing" ? Math.max(6, dailyWords - 2) : dailyWords,
      dailyAccuracy: draftProfile.memoryStyle === "type" ? 85 : 80,
    });
    setStage("vocabulary");
    setCategory(draftProfile.preferredTrack);
    setShowProfileDialog(false);
    showNotice(copy.profileSaved, "success");
  }, [copy.profileSaved, draftProfile, showNotice]);

  const handleStageChange = useCallback((nextStage) => {
    setStage(nextStage);
  }, []);

  const stageLabel = getLocalized(stageCopy[stage].label, locale);
  const stageHelper = getLocalized(stageCopy[stage].helper, locale);
  const focusHint =
    stage === "shadowing"
      ? copy.focusHints.shadowing
      : stage === "speaking"
        ? copy.focusHints.speaking
        : stage === "tenses"
          ? copy.focusHints.tenses
        : stage === "phrases"
          ? studyMode === "en-to-vi"
            ? copy.focusHints.phrasesEnToVi
            : copy.focusHints.phrasesViToEn
          : studyMode === "en-to-vi"
            ? copy.focusHints.vocabularyEnToVi
            : copy.focusHints.vocabularyViToEn;

  const stageItems = useMemo(
    () =>
      STAGES.map((item) => ({
        key: item,
        label: getLocalized(stageCopy[item].label, locale),
        helper: getLocalized(stageCopy[item].helper, locale),
        icon: stageIcons[item],
        subItems: getAllowedCategories(item).map((categoryItem) => ({
          key: categoryItem.key,
          label: getLocalized(categoryItem.label, locale),
          emoji: categoryItem.emoji,
        })),
      })),
    [locale]
  );

  const accuracyValue = accuracy(stats.correctAnswers, stats.totalWords);
  const directionLabel = studyMode === "en-to-vi" ? "EN -> VI" : "VI -> EN";

  const sidebarStats = [
    { label: copy.today, value: `${todayProgress.words}/${goals.dailyWords}` },
    { label: copy.due, value: `${srsMeta.due}` },
    { label: copy.mastered, value: `${srsMeta.mastered}` },
    { label: copy.accuracy, value: `${accuracyValue}%` },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background:
            mode === "dark"
              ? "radial-gradient(circle at top left, #1e3b36 0%, #0c1413 52%, #090f0f 100%)"
              : "radial-gradient(circle at top left, #fffaf2 0%, #f3ead8 52%, #e7d8bc 100%)",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor:
              mode === "dark"
                ? alpha("#0f1817", 0.84)
                : alpha("#fffaf3", 0.9),
            backdropFilter: "blur(18px)",
            borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          }}
        >
          <Toolbar sx={{ gap: 1, minHeight: 72 }}>
            <Stack spacing={0.2} sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {copy.appTitle}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {copy.focusSubtitle}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.75}>
              <Button
                variant={locale === "vi" ? "contained" : "outlined"}
                size="small"
                onClick={() => setLocale("vi")}
                sx={{ minWidth: 52 }}
              >
                VI
              </Button>
              <Button
                variant={locale === "en" ? "contained" : "outlined"}
                size="small"
                onClick={() => setLocale("en")}
                sx={{ minWidth: 52 }}
              >
                EN
              </Button>
            </Stack>

            <IconButton
              onClick={() => setShowInsightsDialog(true)}
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
            >
              <Insights />
            </IconButton>
            <IconButton
              onClick={() => setShowProfileDialog(true)}
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
            >
              <Tune />
            </IconButton>
            <Button
              size="small"
              startIcon={<Insights />}
              onClick={() => setShowInsightsDialog(true)}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              {copy.progress}
            </Button>
            <Button
              size="small"
              startIcon={<Tune />}
              onClick={() => setShowProfileDialog(true)}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              {copy.learningSetup}
            </Button>
            <IconButton onClick={() => setMode((previous) => (previous === "light" ? "dark" : "light"))}>
              {mode === "light" ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            maxWidth: 1460,
            mx: "auto",
            px: { xs: 1.1, sm: 1.5, lg: 2.25 },
            py: { xs: 1.2, md: 1.7 },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack spacing={1.5}>
            <Paper
              sx={{
                width: "100%",
                p: { xs: 1.35, md: 1.8 },
                backgroundColor:
                  mode === "dark"
                    ? alpha(theme.palette.background.paper, 0.82)
                    : alpha("#fffbf6", 0.9),
                border: "none",
                boxShadow:
                  mode === "dark"
                    ? "0 14px 30px rgba(0,0,0,0.14)"
                    : "0 14px 28px rgba(113, 99, 72, 0.08)",
              }}
            >
              <Stack spacing={1.25}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={1.3}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", md: "flex-start" }}
                >
                  <Stack spacing={0.65} sx={{ minWidth: 0 }}>
                    <Chip
                      color="secondary"
                      label={stageLabel}
                      sx={{ alignSelf: "flex-start", fontWeight: 800 }}
                    />
                    <Typography variant="h4">{shellCopy.currentSession}</Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 740 }}>
                      {stageHelper}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 740 }}>
                      {getLocalized(activeCategory.description, locale)}
                    </Typography>
                  </Stack>

                  <Stack
                    spacing={1}
                    sx={{ minWidth: { xs: 0, md: 280 }, width: { xs: "100%", md: "auto" } }}
                  >
                    <Chip
                      variant="outlined"
                      label={`${shellCopy.direction}: ${directionLabel}`}
                      sx={{ alignSelf: { xs: "flex-start", md: "flex-end" } }}
                    />

                    {allowedCategories.length > 1 ? (
                      <FormControl size="small" fullWidth>
                        <InputLabel>{copy.category}</InputLabel>
                        <Select
                          value={safeCategory}
                          label={copy.category}
                          onChange={(event) => setCategory(event.target.value)}
                        >
                          {allowedCategories.map((item) => (
                            <MenuItem key={item.key} value={item.key}>
                              {item.emoji} {getLocalized(item.label, locale)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip
                        variant="outlined"
                        label={`${activeCategory.emoji} ${getLocalized(activeCategory.label, locale)}`}
                        sx={{ justifyContent: "flex-start" }}
                      />
                    )}
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap" }} useFlexGap>
                  {stageItems.map((item) => {
                    const selected = item.key === stage;
                    return (
                      <Chip
                        key={item.key}
                        icon={item.icon}
                        label={item.label}
                        onClick={() => handleStageChange(item.key)}
                        color={selected ? "primary" : "default"}
                        variant={selected ? "filled" : "outlined"}
                        sx={{ fontWeight: selected ? 700 : 500 }}
                      />
                    );
                  })}
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
                    gap: 0.9,
                  }}
                >
                  {sidebarStats.map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        p: 1,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.background.paper, 0.6),
                        border: "none",
                        boxShadow: "none",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography sx={{ mt: 0.15, fontWeight: 800 }}>{item.value}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    p: 1,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                    border: "none",
                    boxShadow: "none",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {copy.recentTitle}
                  </Typography>
                  <Stack direction="row" spacing={0.8} sx={{ mt: 0.6, flexWrap: "wrap" }} useFlexGap>
                    {history.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        {copy.noHistory}
                      </Typography>
                    ) : (
                      history.slice(0, 6).map((item, index) => (
                        <Chip
                          key={`${item.word}-${index}`}
                          size="small"
                          label={`${item.word} • ${item.timeTaken}s`}
                          color={item.correct ? "success" : "warning"}
                          variant="outlined"
                        />
                      ))
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            <Paper
              sx={{
                width: "100%",
                p: { xs: 1.05, md: 1.2 },
                backgroundColor:
                  mode === "dark"
                    ? alpha(theme.palette.background.paper, 0.84)
                    : "rgba(255, 250, 243, 0.94)",
                border: "none",
                boxShadow:
                  mode === "dark"
                    ? "0 16px 38px rgba(0, 0, 0, 0.2)"
                    : "0 16px 34px rgba(117, 101, 72, 0.1)",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    xl: "minmax(0, 1.16fr) minmax(360px, 0.84fr)",
                  },
                  gap: 1.35,
                  alignItems: "start",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 6,
                    p: { xs: 1.05, md: 1.2 },
                    background:
                      mode === "dark"
                        ? alpha("#ffffff", 0.025)
                        : alpha("#ffffff", 0.52),
                    border: "none",
                  }}
                >

                <Flashcard
                  locale={locale}
                  prompt={currentPrompt}
                  answer={answerBundle.primary}
                  phonetic={currentWord?.phonetic}
                  audio={currentWord?.audio}
                  showDetail={showDetail}
                  studyMode={studyMode}
                  categoryLabel={getLocalized(activeCategory.label, locale)}
                  stageLabel={stageLabel}
                  imageHint={currentWord?.imageHint}
                  scene={currentWord?.scene}
                  partOfSpeech={currentWord?.partOfSpeech ? getLocalized(posLabels[currentWord.partOfSpeech], locale) : ""}
                  grammarTag={currentWord?.grammarTag ? getLocalized(currentWord.grammarTag, locale) : ""}
                  alternatives={answerBundle.alternatives}
                  learnerHint={currentWord?.learnerHint}
                  emptyText={copy.noDeck}
                  meta={{ level: currentCard?.level ?? 0, dueAt: currentCard?.dueAt }}
                />

                </Paper>

                <Box sx={{ position: { xl: "sticky" }, top: { xl: 88 } }}>
                  <Paper
                    sx={{
                      borderRadius: 6,
                      p: { xs: 1.05, md: 1.2 },
                      background:
                        mode === "dark"
                          ? "linear-gradient(180deg, rgba(19, 33, 31, 0.98), rgba(15, 24, 23, 0.98))"
                          : "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,248,239,0.94))",
                      border: "none",
                      boxShadow:
                        mode === "dark"
                          ? "0 12px 28px rgba(0,0,0,0.16)"
                          : "0 12px 24px rgba(120, 101, 73, 0.09)",
                    }}
                  >
                    <Stack spacing={1.1}>
                      <Box>
                        <Typography variant="overline" color="text.secondary">
                          {stageLabel}
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 0.2 }}>
                          {shellCopy.responsePanel}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.55, lineHeight: 1.55 }}
                        >
                          {shellCopy.responseHelper}
                        </Typography>
                      </Box>

                <QuizForm
                  locale={locale}
                  answer={answerBundle.primary}
                  acceptedAnswers={answerBundle.accepted}
                  alternatives={answerBundle.alternatives}
                  label={studyMode === "en-to-vi" ? copy.answerVi : copy.answerEn}
                  onNext={handleAnswer}
                  onShowDetail={setShowDetail}
                  assistantHint={focusHint}
                  learnerHint={currentWord?.learnerHint}
                  enableSpeech={stage === "speaking"}
                  submitLabel={stage === "shadowing" ? (locale === "vi" ? "Đã nhại xong" : "Done shadowing") : locale === "vi" ? "Kiểm tra" : "Check"}
                />

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1,
                          borderRadius: 4,
                          bgcolor:
                            mode === "dark"
                              ? alpha("#ffffff", 0.03)
                              : alpha(theme.palette.primary.main, 0.04),
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
                          {copy.focusRule}
                        </Typography>
                      </Paper>
                    </Stack>
                  </Paper>
                </Box>
              </Box>
            </Paper>
            </Stack>
          </Box>
        </Box>

        <Dialog open={showInsightsDialog} onClose={() => setShowInsightsDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>{copy.roadmapTitle}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={`${copy.today} ${todayProgress.words}/${goals.dailyWords}`} />
                  <Chip label={`${copy.accuracy} ${accuracy(stats.correctAnswers, stats.totalWords)}%`} />
                  <Chip label={`${copy.due} ${srsMeta.due}`} />
                  <Chip label={`${copy.mastered} ${srsMeta.mastered}`} />
                </Stack>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2 }}>
                {copy.roadmap.map((item) => <Typography key={item} variant="body2" color="text.secondary" sx={{ mb: 0.85 }}>{item}</Typography>)}
              </Paper>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>{copy.recentTitle}</Typography>
                {history.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">{copy.noHistory}</Typography>
                ) : (
                  history.slice(0, 6).map((item, index) => (
                    <Typography key={`${item.word}-${index}`} variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                      {item.correct ? copy.historyCorrect : copy.historyWrong} • {item.word} • {item.timeTaken}s
                    </Typography>
                  ))
                )}
              </Paper>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}><Button onClick={() => setShowInsightsDialog(false)}>{copy.close}</Button></DialogActions>
        </Dialog>

        <Dialog open={showProfileDialog} onClose={() => setShowProfileDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>{copy.profileTitle}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.2} sx={{ pt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>{copy.dailyMinutes}</InputLabel>
                <Select value={draftProfile.dailyMinutes} label={copy.dailyMinutes} onChange={(event) => setDraftProfile((previous) => ({ ...previous, dailyMinutes: event.target.value }))}>
                  {Object.entries(copy.profileOptions.dailyMinutes).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>{copy.biggestPain}</InputLabel>
                <Select value={draftProfile.focusPain} label={copy.biggestPain} onChange={(event) => setDraftProfile((previous) => ({ ...previous, focusPain: event.target.value }))}>
                  {Object.entries(copy.profileOptions.focusPain).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>{copy.memoryStyle}</InputLabel>
                <Select value={draftProfile.memoryStyle} label={copy.memoryStyle} onChange={(event) => setDraftProfile((previous) => ({ ...previous, memoryStyle: event.target.value }))}>
                  {Object.entries(copy.profileOptions.memoryStyle).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>{copy.preferredTrack}</InputLabel>
                <Select value={draftProfile.preferredTrack} label={copy.preferredTrack} onChange={(event) => setDraftProfile((previous) => ({ ...previous, preferredTrack: event.target.value }))}>
                  {categories.filter((item) => item.section === "vocabulary").map((item) => <MenuItem key={item.key} value={item.key}>{item.emoji} {getLocalized(item.label, locale)}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setShowProfileDialog(false)}>{copy.later}</Button>
            <Button onClick={handleSaveProfile} variant="contained">{copy.save}</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={notification.open} autoHideDuration={2600} onClose={() => setNotification((previous) => ({ ...previous, open: false }))} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert variant="filled" severity={notification.severity} onClose={() => setNotification((previous) => ({ ...previous, open: false }))}>{notification.message}</Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
>>>>>>> 7b833e9 (hotfix/ui)
