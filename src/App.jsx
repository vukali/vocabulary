import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ImportOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  MenuOutlined,
  MoonOutlined,
  SettingOutlined,
  SunOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  ConfigProvider,
  Drawer,
  Form,
  Grid,
  Layout,
  Modal,
  Progress,
  Radio,
  Select,
  Segmented,
  Space,
  Steps,
  Switch,
  Tabs,
  Tag,
  Typography,
  message,
  theme as antdTheme,
} from "antd";
import Flashcard from "./components/Flashcard";
import QuizForm from "./components/QuizForm";
import Sidebar from "./components/Sidebar";
import { missionCatalog } from "./data/missions";
import { categories, vocabData } from "./data/vocab";
import { posLabels, stageCopy, uiCopy } from "./data/uiCopy";
import {
  applyReview,
  getNextCardWord,
  getProgressSummary,
  getWeakCardWords,
  loadSrsStatePersisted,
  makeCardId,
  saveSrsState,
} from "./utils/srs";
import {
  accuracy,
  buildStageItems,
  getAllowedCategories,
  getFocusHint,
  getLocalized,
  mapLegacyCategory,
  pickDirection,
  sanitizeCategory,
} from "./utils/learning";
import {
  annotateDeck,
  filterDeckByWords,
  getFrequencyMeta,
} from "./utils/deck";
import { buildSentenceExpansion } from "./utils/examples";
import {
  clearImportedDecks,
  loadImportedDecks,
  loadImportedDecksPersisted,
  mergeImportedDecks,
  parseImportText,
  saveImportedDecks,
} from "./utils/importDecks";
import {
  hasStorageKey,
  migrateStorageKeysToIndexedDb,
  readPersistentJson,
  readPersistentText,
  readStorageArray,
  readStorageObject,
  readStorageText,
  writeStorageEntries,
} from "./utils/storage";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const PROFILE_KEY = "vocabLearnerProfile";
const GOALS_KEY = "vocabGoals";
const STATS_KEY = "vocabStats";
const HISTORY_KEY = "vocabHistory";
const THEME_KEY = "themeMode";
const STAGE_KEY = "learningStage";
const LOCALE_KEY = "uiLocale";
const CATEGORY_KEY = "activeDeck";
const PRACTICE_MODE_KEY = "practiceMode";
const APP_PERSIST_KEYS = [
  PROFILE_KEY,
  GOALS_KEY,
  STATS_KEY,
  HISTORY_KEY,
  THEME_KEY,
  STAGE_KEY,
  LOCALE_KEY,
  CATEGORY_KEY,
  PRACTICE_MODE_KEY,
  "vocabImportedDecks",
];

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

const sanitizeProfile = (value) => ({
  ...DEFAULT_PROFILE,
  ...(value && typeof value === "object" ? value : {}),
});

const sanitizeGoals = (value) => {
  const source = value && typeof value === "object" ? value : {};
  return {
    dailyWords:
      Number.isFinite(Number(source.dailyWords)) && Number(source.dailyWords) > 0
        ? Number(source.dailyWords)
        : DEFAULT_GOALS.dailyWords,
    dailyAccuracy:
      Number.isFinite(Number(source.dailyAccuracy)) && Number(source.dailyAccuracy) > 0
        ? Number(source.dailyAccuracy)
        : DEFAULT_GOALS.dailyAccuracy,
  };
};

const sanitizeDirectionStats = (value) => ({
  total:
    Number.isFinite(Number(value?.total)) && Number(value.total) >= 0
      ? Number(value.total)
      : 0,
  correct:
    Number.isFinite(Number(value?.correct)) && Number(value.correct) >= 0
      ? Number(value.correct)
      : 0,
});

const sanitizeDailyProgress = (items) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item && typeof item === "object" && item.date)
    .map((item) => ({
      date: String(item.date),
      words: Number.isFinite(Number(item.words)) ? Number(item.words) : 0,
      correct: Number.isFinite(Number(item.correct)) ? Number(item.correct) : 0,
      time: Number.isFinite(Number(item.time)) ? Number(item.time) : 0,
      enToVi: sanitizeDirectionStats(item.enToVi),
      viToEn: sanitizeDirectionStats(item.viToEn),
    }));

const sanitizeStats = (value) => {
  const source = value && typeof value === "object" ? value : {};
  return {
    ...EMPTY_STATS,
    totalWords:
      Number.isFinite(Number(source.totalWords)) && Number(source.totalWords) >= 0
        ? Number(source.totalWords)
        : 0,
    correctAnswers:
      Number.isFinite(Number(source.correctAnswers)) && Number(source.correctAnswers) >= 0
        ? Number(source.correctAnswers)
        : 0,
    averageTime:
      Number.isFinite(Number(source.averageTime)) && Number(source.averageTime) >= 0
        ? Number(source.averageTime)
        : 0,
    dailyProgress: sanitizeDailyProgress(source.dailyProgress),
    enToVi: sanitizeDirectionStats(source.enToVi),
    viToEn: sanitizeDirectionStats(source.viToEn),
  };
};

const sanitizeHistory = (items) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item && typeof item === "object" && item.word)
    .map((item) => ({
      word: String(item.word),
      correct: Boolean(item.correct),
      timeTaken:
        Number.isFinite(Number(item.timeTaken)) && Number(item.timeTaken) >= 0
          ? Number(item.timeTaken)
          : 0,
      stage: typeof item.stage === "string" ? item.stage : "vocabulary",
      mode: typeof item.mode === "string" ? item.mode : "standard",
    }));

const todayKey = () => new Date().toISOString().split("T")[0];

const practiceCopy = {
  vi: {
    standard: "Luồng chuẩn",
    weak: "Từ yếu",
    mission: "Mission",
    noWeakCards:
      "Deck này chưa có thẻ yếu. Hãy học thêm để app tự gom các từ hay sai vào Weak mode.",
    missionCompleted:
      "Mission hôm nay đã xong. Bạn có thể quay lại luồng chuẩn hoặc làm lại để nhớ chắc hơn.",
    missionTitle: "Mission hôm nay",
    missionGoal: "Mục tiêu",
    missionProgress: "Tiến độ mission",
    weakTitle: "Weak words mode",
    weakDescription:
      "Chỉ hiện các thẻ bạn đã sai ít nhất 2 lần hoặc đang có weak score cao.",
    weakCount: "Từ yếu",
    importTitle: "Import JSON / CSV",
    importHint:
      "Dùng file JSON hoặc CSV để bơm thêm rất nhiều flashcard mà không cần sửa code.",
    importAppend: "Gộp thêm",
    importReplace: "Thay deck import",
    importOpen: "Chọn file",
    importSuccess: "Đã import thành công",
    importEmpty: "Không đọc được dòng hợp lệ nào từ file này.",
    importError: "File không hợp lệ hoặc parse thất bại.",
    importClear: "Xóa deck import",
    importSummary: "Kết quả import gần nhất",
    importVocab: "Từ vựng import",
    importPhrases: "Câu import",
    importSources: "Nguồn file",
    modeLabel: "Cách học",
    importedHint: "Deck import sẽ tự xuất hiện ở sidebar bên trái.",
    missionWin: "Mission hôm nay đã chạm mục tiêu.",
  },
  en: {
    standard: "Standard",
    weak: "Weak words",
    mission: "Mission",
    noWeakCards:
      "This deck has no weak cards yet. Study more and the app will collect your trouble words here.",
    missionCompleted:
      "Today's mission is complete. You can switch back to the standard flow or replay it for stronger recall.",
    missionTitle: "Today's mission",
    missionGoal: "Goal",
    missionProgress: "Mission progress",
    weakTitle: "Weak words mode",
    weakDescription:
      "Only cards you missed at least twice or cards with a high weak score appear here.",
    weakCount: "Weak cards",
    importTitle: "Import JSON / CSV",
    importHint:
      "Use JSON or CSV to inject many flashcards without changing the codebase.",
    importAppend: "Append",
    importReplace: "Replace imported decks",
    importOpen: "Choose file",
    importSuccess: "Import completed",
    importEmpty: "No valid rows were found in this file.",
    importError: "The file is invalid or parsing failed.",
    importClear: "Clear imported decks",
    importSummary: "Latest import summary",
    importVocab: "Imported vocab",
    importPhrases: "Imported phrases",
    importSources: "File sources",
    modeLabel: "Learning mode",
    importedHint: "Imported decks will appear automatically in the left sidebar.",
    missionWin: "Today's mission reached its target.",
  },
};

const getMissionOfDay = () => {
  const hash = todayKey()
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return missionCatalog[hash % missionCatalog.length];
};

function App() {
  const bootstrapRef = useRef(null);
  if (!bootstrapRef.current) {
    const savedProfile = sanitizeProfile(readStorageObject(PROFILE_KEY, {}));
    const storedStage = readStorageText(STAGE_KEY, "vocabulary");
    const initialStage = STAGES.includes(storedStage) ? storedStage : "vocabulary";
    const storedTheme = readStorageText(THEME_KEY, "light");
    const initialTheme = storedTheme === "dark" ? "dark" : "light";
    const storedLocale = readStorageText(LOCALE_KEY, "vi");
    const initialLocale = storedLocale === "en" ? "en" : "vi";
    const storedPracticeMode = readStorageText(PRACTICE_MODE_KEY, "standard");
    const initialPracticeMode =
      storedPracticeMode === "weak" || storedPracticeMode === "mission"
        ? storedPracticeMode
        : "standard";
    const initialCategory = sanitizeCategory(
      initialStage,
      readStorageText(CATEGORY_KEY, savedProfile.preferredTrack),
      savedProfile.preferredTrack
    );

    bootstrapRef.current = {
      savedProfile,
      savedProfileExists: hasStorageKey(PROFILE_KEY),
      initialStage,
      initialTheme,
      initialLocale,
      initialPracticeMode,
      initialCategory,
    };
  }

  const {
    savedProfile,
    savedProfileExists,
    initialStage,
    initialTheme,
    initialLocale,
    initialPracticeMode,
    initialCategory,
  } = bootstrapRef.current;

  const screens = useBreakpoint();
  const isDesktop = Boolean(screens.lg);
  const [messageApi, contextHolder] = message.useMessage();
  const fileInputRef = useRef(null);
  const skipNextCardIdRef = useRef(null);

  const [mode, setMode] = useState(initialTheme);
  const [locale, setLocale] = useState(initialLocale);
  const [stage, setStage] = useState(initialStage);
  const [profile, setProfile] = useState(savedProfile);
  const [draftProfile, setDraftProfile] = useState(savedProfile);
  const [goals, setGoals] = useState(() => sanitizeGoals(readStorageObject(GOALS_KEY, {})));
  const [stats, setStats] = useState(() => sanitizeStats(readStorageObject(STATS_KEY, {})));
  const [history, setHistory] = useState(() =>
    sanitizeHistory(readStorageArray(HISTORY_KEY, []))
  );
  const [category, setCategory] = useState(initialCategory);
  const [practiceMode, setPracticeMode] = useState(initialPracticeMode);
  const [showProfileDialog, setShowProfileDialog] = useState(!savedProfileExists);
  const [showInsightsDialog, setShowInsightsDialog] = useState(false);
  const [showConceptDialog, setShowConceptDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [studyMode, setStudyMode] = useState("en-to-vi");
  const [currentWord, setCurrentWord] = useState(null);
  const [srsState, setSrsState] = useState({});
  const [safeCategorySrsState, setSafeCategorySrsState] = useState({});
  const [srsMeta, setSrsMeta] = useState({
    total: 0,
    learned: 0,
    mastered: 0,
    due: 0,
    weak: 0,
  });
  const [startTime, setStartTime] = useState(Date.now());
  const [reviewResult, setReviewResult] = useState(null);
  const [importStrategy, setImportStrategy] = useState("append");
  const [importReport, setImportReport] = useState(null);
  const [importedDecks, setImportedDecks] = useState(() => loadImportedDecks());
  const [missionCompleted, setMissionCompleted] = useState([]);

  const copy = uiCopy[locale] || uiCopy.vi;
  const feature = practiceCopy[locale] || practiceCopy.vi;
  const stageItems = useMemo(() => buildStageItems(locale), [locale]);
  const todayMission = useMemo(() => getMissionOfDay(), []);

  const antThemeConfig = useMemo(
    () => ({
      algorithm:
        mode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: mode === "dark" ? "#79d0b3" : "#1f7a72",
        colorInfo: mode === "dark" ? "#79d0b3" : "#1f7a72",
        colorSuccess: mode === "dark" ? "#96d986" : "#2f8a57",
        colorWarning: mode === "dark" ? "#f5bf70" : "#d38b24",
        colorError: mode === "dark" ? "#ff8f83" : "#d9534f",
        borderRadius: 18,
        wireframe: false,
        fontFamily: '"Be Vietnam Pro", "Segoe UI", "Trebuchet MS", sans-serif',
      },
      components: {
        Layout: {
          headerBg: "transparent",
          siderBg: "transparent",
          bodyBg: "transparent",
          triggerBg: "transparent",
        },
        Card: {
          borderRadiusLG: 24,
        },
        Button: {
          borderRadius: 14,
          controlHeightLG: 46,
        },
        Input: {
          borderRadiusLG: 16,
          controlHeightLG: 48,
        },
        Select: {
          borderRadiusLG: 16,
          controlHeightLG: 46,
        },
        Menu: {
          itemBorderRadius: 14,
          itemHeight: 42,
          subMenuItemBorderRadius: 12,
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
  const rawDecks = useMemo(
    () => ({
      ...vocabData,
      importedvocab: importedDecks.vocabulary,
      importedphrases: importedDecks.phrases,
    }),
    [importedDecks]
  );
  const activeCategory = useMemo(
    () => categories.find((item) => item.key === safeCategory) || categories[0],
    [safeCategory]
  );
  const selectedDeckWords = useMemo(
    () => annotateDeck(rawDecks[safeCategory] || []),
    [rawDecks, safeCategory]
  );
  const missionCategoryKey = todayMission.category;
  const missionBaseDeck = useMemo(
    () => annotateDeck(rawDecks[missionCategoryKey] || []),
    [missionCategoryKey, rawDecks]
  );
  const missionDeck = useMemo(
    () => filterDeckByWords(missionBaseDeck, todayMission.cardWords),
    [missionBaseDeck, todayMission.cardWords]
  );
  const missionRemainingWords = useMemo(() => {
    const done = new Set(missionCompleted);
    return missionDeck.filter((item) => !done.has(String(item.word).toLowerCase()));
  }, [missionCompleted, missionDeck]);
  const activeDeckKey = practiceMode === "mission" ? missionCategoryKey : safeCategory;
  const effectiveStage = practiceMode === "mission" ? todayMission.stage : stage;
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
  const weakPreviewCount = useMemo(() => {
    const weakState =
      practiceMode === "mission" ? safeCategorySrsState : srsState;
    return getWeakCardWords(safeCategory, selectedDeckWords, weakState).length;
  }, [practiceMode, safeCategory, safeCategorySrsState, selectedDeckWords, srsState]);
  const activeDeckWords = useMemo(() => {
    if (practiceMode === "mission") return missionRemainingWords;
    if (practiceMode === "weak") {
      return getWeakCardWords(safeCategory, selectedDeckWords, srsState);
    }
    return selectedDeckWords;
  }, [missionRemainingWords, practiceMode, safeCategory, selectedDeckWords, srsState]);
  const summaryWords = practiceMode === "mission" ? missionDeck : selectedDeckWords;
  const answerBundle = useMemo(() => {
    if (!currentWord) return { primary: "", accepted: [], alternatives: [] };
    const primary = studyMode === "en-to-vi" ? currentWord.meaning : currentWord.word;
    const alternatives =
      studyMode === "en-to-vi"
        ? currentWord.alternativesVi || []
        : currentWord.alternativesEn || [];
    return { primary, accepted: [primary, ...alternatives], alternatives };
  }, [currentWord, studyMode]);
  const currentPrompt = currentWord
    ? studyMode === "en-to-vi"
      ? currentWord.word
      : currentWord.meaning
    : "";
  const currentSpeechText = currentWord?.word || "";
  const currentCard = currentWord?.word
    ? srsState[makeCardId(activeDeckKey, currentWord.word)]
    : null;
  const currentExamples = useMemo(
    () => buildSentenceExpansion(currentWord, locale),
    [currentWord, locale]
  );
  const missionSolvedCount = missionDeck.length - missionRemainingWords.length;
  const missionProgressPercent = todayMission.goal
    ? Math.min(100, Math.round((missionSolvedCount / todayMission.goal) * 100))
    : 0;
  const stageLabel = getLocalized(stageCopy[effectiveStage].label, locale);
  const stageHelper =
    practiceMode === "mission"
      ? getLocalized(todayMission.objective, locale)
      : getLocalized(stageCopy[effectiveStage].helper, locale);
  const sessionTitle =
    practiceMode === "mission"
      ? getLocalized(todayMission.title, locale)
      : practiceMode === "weak"
        ? feature.weakTitle
        : copy.sessionTitle;
  const sessionDescription =
    practiceMode === "mission"
      ? getLocalized(todayMission.summary, locale)
      : practiceMode === "weak"
        ? feature.weakDescription
        : getLocalized(activeCategory.description, locale);
  const focusHint =
    practiceMode === "mission"
      ? `${getLocalized(todayMission.objective, locale)} ${getFocusHint(
          copy,
          effectiveStage,
          studyMode
        )}`
      : getFocusHint(copy, effectiveStage, studyMode);
  const directionLabel = studyMode === "en-to-vi" ? "EN -> VI" : "VI -> EN";
  const accuracyValue = accuracy(stats.correctAnswers, stats.totalWords);
  const completionPercent = Math.min(
    100,
    goals.dailyWords ? Math.round((todayProgress.words / goals.dailyWords) * 100) : 0
  );
  const hasImportedDecks =
    importedDecks.vocabulary.length > 0 || importedDecks.phrases.length > 0;
  const importedAtLabel = importedDecks.meta?.lastImportedAt
    ? new Date(importedDecks.meta.lastImportedAt).toLocaleString(
        locale === "vi" ? "vi-VN" : "en-US"
      )
    : "--";

  const sidebarStats = [
    { label: copy.today, value: `${todayProgress.words}/${goals.dailyWords}` },
    { label: copy.due, value: `${srsMeta.due}` },
    { label: feature.weakCount, value: `${srsMeta.weak}` },
    { label: copy.accuracy, value: `${accuracyValue}%` },
  ];

  useEffect(() => {
    document.body.dataset.theme = mode;
  }, [mode]);

  useEffect(() => {
    if (category !== safeCategory) setCategory(safeCategory);
  }, [category, safeCategory]);

  useEffect(() => {
    let alive = true;

    const hydrateAppState = async () => {
      await migrateStorageKeysToIndexedDb(APP_PERSIST_KEYS);

      const [
        persistedProfile,
        persistedGoals,
        persistedStats,
        persistedHistory,
        persistedTheme,
        persistedLocale,
        persistedStage,
        persistedCategory,
        persistedPracticeMode,
      ] = await Promise.all([
        readPersistentJson(PROFILE_KEY, savedProfile),
        readPersistentJson(GOALS_KEY, DEFAULT_GOALS),
        readPersistentJson(STATS_KEY, EMPTY_STATS),
        readPersistentJson(HISTORY_KEY, []),
        readPersistentText(THEME_KEY, initialTheme),
        readPersistentText(LOCALE_KEY, initialLocale),
        readPersistentText(STAGE_KEY, initialStage),
        readPersistentText(CATEGORY_KEY, initialCategory),
        readPersistentText(PRACTICE_MODE_KEY, initialPracticeMode),
      ]);

      if (!alive) return;

      const nextProfile = sanitizeProfile(persistedProfile);
      const nextStage = STAGES.includes(persistedStage) ? persistedStage : initialStage;
      const nextLocale = persistedLocale === "en" ? "en" : "vi";
      const nextTheme = persistedTheme === "dark" ? "dark" : "light";
      const nextPracticeMode =
        persistedPracticeMode === "weak" || persistedPracticeMode === "mission"
          ? persistedPracticeMode
          : "standard";

      setProfile(nextProfile);
      setDraftProfile(nextProfile);
      setGoals(sanitizeGoals(persistedGoals));
      setStats(sanitizeStats(persistedStats));
      setHistory(sanitizeHistory(persistedHistory));
      setMode(nextTheme);
      setLocale(nextLocale);
      setStage(nextStage);
      setPracticeMode(nextPracticeMode);
      setCategory(
        sanitizeCategory(nextStage, persistedCategory, nextProfile.preferredTrack)
      );
    };

    void hydrateAppState();

    return () => {
      alive = false;
    };
  }, [
    initialCategory,
    initialLocale,
    initialPracticeMode,
    initialStage,
    initialTheme,
    savedProfile,
  ]);

  useEffect(() => {
    let alive = true;

    const loadActiveSrs = async () => {
      const loaded = await loadSrsStatePersisted(activeDeckKey);
      if (alive) setSrsState(loaded);
    };

    void loadActiveSrs();

    return () => {
      alive = false;
    };
  }, [activeDeckKey]);

  useEffect(() => {
    let alive = true;

    const loadSafeCategorySrs = async () => {
      const loaded = await loadSrsStatePersisted(safeCategory);
      if (alive) setSafeCategorySrsState(loaded);
    };

    void loadSafeCategorySrs();

    return () => {
      alive = false;
    };
  }, [safeCategory]);

  useEffect(() => {
    let alive = true;

    const hydrateImportedDecks = async () => {
      const loaded = await loadImportedDecksPersisted();
      if (alive) setImportedDecks(loaded);
    };

    void hydrateImportedDecks();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setSrsMeta(getProgressSummary(activeDeckKey, summaryWords, srsState));
  }, [activeDeckKey, srsState, summaryWords]);

  useEffect(() => {
    if (reviewResult) return;

    const skippedCardId = skipNextCardIdRef.current;
    const direction =
      practiceMode === "mission"
        ? todayMission.direction || pickDirection(effectiveStage)
        : pickDirection(effectiveStage);
    const candidateWords =
      skippedCardId && activeDeckWords.length > 1
        ? activeDeckWords.filter(
            (item) => makeCardId(activeDeckKey, item.word) !== skippedCardId
          )
        : activeDeckWords;
    const picked = getNextCardWord(
      activeDeckKey,
      candidateWords.length > 0 ? candidateWords : activeDeckWords,
      srsState
    ).chosen;

    skipNextCardIdRef.current = null;
    setStudyMode(direction);
    setCurrentWord(picked ? { ...picked, direction } : null);
  }, [
    activeDeckKey,
    activeDeckWords,
    effectiveStage,
    practiceMode,
    reviewResult,
    srsState,
    todayMission.direction,
  ]);

  useEffect(() => {
    writeStorageEntries([
      [THEME_KEY, mode],
      [LOCALE_KEY, locale],
      [STAGE_KEY, stage],
      [CATEGORY_KEY, safeCategory],
      [PRACTICE_MODE_KEY, practiceMode],
      [PROFILE_KEY, JSON.stringify(profile)],
      [GOALS_KEY, JSON.stringify(goals)],
      [STATS_KEY, JSON.stringify(stats)],
      [HISTORY_KEY, JSON.stringify(history)],
    ]);
  }, [goals, history, locale, mode, practiceMode, profile, safeCategory, stage, stats]);

  useEffect(() => {
    setDraftProfile(profile);
  }, [profile]);

  useEffect(() => {
    setReviewResult(null);
    setStartTime(Date.now());
  }, [activeDeckKey, effectiveStage, practiceMode]);

  useEffect(() => {
    setMissionCompleted([]);
  }, [practiceMode, todayMission.key]);

  const handleReviewSubmit = useCallback(
    ({ isCorrect, submittedValue }) => {
      if (!currentWord || reviewResult) return;

      const now = Date.now();
      const timeTaken = Math.max(1, Math.round((now - startTime) / 1000));
      const day = todayKey();
      const nextState = { ...srsState };

      applyReview(nextState, makeCardId(activeDeckKey, currentWord.word), isCorrect, now);
      saveSrsState(activeDeckKey, nextState);
      setSrsState(nextState);
      if (activeDeckKey === safeCategory) {
        setSafeCategorySrsState(nextState);
      }

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
          ((previous.averageTime || 0) * (previous.totalWords || 0) + timeTaken) /
          next.totalWords;

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
            enToVi: {
              total: studyMode === "en-to-vi" ? 1 : 0,
              correct: studyMode === "en-to-vi" && isCorrect ? 1 : 0,
            },
            viToEn: {
              total: studyMode === "vi-to-en" ? 1 : 0,
              correct: studyMode === "vi-to-en" && isCorrect ? 1 : 0,
            },
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
              correct:
                entry.enToVi.correct + (studyMode === "en-to-vi" && isCorrect ? 1 : 0),
            },
            viToEn: {
              total: entry.viToEn.total + (studyMode === "vi-to-en" ? 1 : 0),
              correct:
                entry.viToEn.correct + (studyMode === "vi-to-en" && isCorrect ? 1 : 0),
            },
          };
        }

        return next;
      });

      setHistory((previous) =>
        [
          { word: currentWord.word, correct: isCorrect, timeTaken, stage: effectiveStage, mode: practiceMode },
          ...previous,
        ].slice(0, 20)
      );

      if (practiceMode === "mission" && isCorrect) {
        const missionWord = String(currentWord.word).toLowerCase();
        if (!missionCompleted.includes(missionWord)) {
          const nextMissionCount = missionCompleted.length + 1;
          setMissionCompleted([...missionCompleted, missionWord]);

          if (nextMissionCount >= todayMission.goal && missionCompleted.length < todayMission.goal) {
            messageApi.success(feature.missionWin);
          }
        }
      }

      setReviewResult({
        isCorrect,
        submittedValue,
        timeTaken,
      });

      messageApi.open({
        type: isCorrect ? "success" : "warning",
        content: isCorrect ? copy.correctToast : copy.wrongToast,
        duration: 1.6,
      });
    },
    [
      copy.correctToast,
      copy.wrongToast,
      currentWord,
      activeDeckKey,
      effectiveStage,
      feature.missionWin,
      messageApi,
      missionCompleted,
      practiceMode,
      reviewResult,
      safeCategory,
      srsState,
      startTime,
      studyMode,
      todayMission.goal,
    ]
  );

  const handleContinue = useCallback(() => {
    skipNextCardIdRef.current = currentWord?.word
      ? makeCardId(activeDeckKey, currentWord.word)
      : null;
    setReviewResult(null);
    setStartTime(Date.now());
  }, [activeDeckKey, currentWord]);

  const handleSaveProfile = useCallback(() => {
    const mappedTrack = mapLegacyCategory(draftProfile.preferredTrack);
    const dailyWords =
      draftProfile.dailyMinutes === "20"
        ? 24
        : draftProfile.dailyMinutes === "5"
          ? 8
          : 14;

    setProfile({
      ...draftProfile,
      preferredTrack: mappedTrack,
    });
    setGoals({
      dailyWords: draftProfile.focusPain === "typing" ? Math.max(6, dailyWords - 2) : dailyWords,
      dailyAccuracy: draftProfile.memoryStyle === "type" ? 85 : 80,
    });
    setStage("vocabulary");
    setCategory(mappedTrack);
    setShowProfileDialog(false);
    messageApi.success(copy.profileSaved);
  }, [copy.profileSaved, draftProfile, messageApi]);

  const handleRouteChange = useCallback(
    (nextStage, nextCategory) => {
      if (practiceMode === "mission") {
        setPracticeMode("standard");
      }

      setStage(nextStage);
      setCategory(sanitizeCategory(nextStage, nextCategory, profile.preferredTrack));
      setMobileNavOpen(false);
    },
    [practiceMode, profile.preferredTrack]
  );

  const handleModeChange = useCallback(
    (nextMode) => {
      if (nextMode === "weak" && weakPreviewCount === 0) {
        messageApi.info(feature.noWeakCards);
        return;
      }

      if (nextMode === "mission" && missionDeck.length === 0) {
        messageApi.info(copy.noDeck);
        return;
      }

      setPracticeMode(nextMode);
      setReviewResult(null);
    },
    [copy.noDeck, feature.noWeakCards, messageApi, missionDeck.length, weakPreviewCount]
  );

  const handleImportFile = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const extension = file.name.toLowerCase().endsWith(".csv") ? "csv" : "json";
        const parsed = parseImportText(text, extension);

        if (!parsed.total) {
          setImportReport({
            fileName: file.name,
            vocabulary: 0,
            phrases: 0,
            total: 0,
          });
          messageApi.warning(feature.importEmpty);
          return;
        }

        const merged = mergeImportedDecks(
          importedDecks,
          parsed,
          importStrategy,
          file.name
        );
        saveImportedDecks(merged);
        setImportedDecks(merged);
        setImportReport({
          fileName: file.name,
          vocabulary: parsed.vocabulary.length,
          phrases: parsed.phrases.length,
          total: parsed.total,
          sources: merged.meta.sources,
        });
        setPracticeMode("standard");

        if (parsed.vocabulary.length > 0) {
          setStage("vocabulary");
          setCategory("importedvocab");
        } else if (parsed.phrases.length > 0) {
          setStage("phrases");
          setCategory("importedphrases");
        }

        messageApi.success(
          `${feature.importSuccess}: ${parsed.total} ${
            locale === "vi" ? "thẻ" : "cards"
          }`
        );
      } catch {
        messageApi.error(feature.importError);
      } finally {
        event.target.value = "";
      }
    },
    [
      feature.importEmpty,
      feature.importError,
      feature.importSuccess,
      importStrategy,
      importedDecks,
      locale,
      messageApi,
    ]
  );

  const handleClearImported = useCallback(() => {
    clearImportedDecks();
    setImportedDecks(loadImportedDecks());
    setImportReport(null);

    if (safeCategory === "importedvocab") {
      setStage("vocabulary");
      setCategory(profile.preferredTrack);
    }

    if (safeCategory === "importedphrases") {
      setStage("phrases");
      setCategory("phrases");
    }

    if (practiceMode !== "standard") {
      setPracticeMode("standard");
    }

    messageApi.success(feature.importClear);
  }, [feature.importClear, messageApi, practiceMode, profile.preferredTrack, safeCategory]);

  const deckSelectOptions = allowedCategories.map((item) => {
    const importedCount =
      item.key === "importedvocab" || item.key === "importedphrases"
        ? (rawDecks[item.key] || []).length
        : null;

    return {
      label: `${item.emoji} ${getLocalized(item.label, locale)}${
        importedCount !== null ? ` (${importedCount})` : ""
      }`,
      value: item.key,
    };
  });

  const conceptTabItems = Object.entries(copy.conceptTabs).map(([key, value]) => ({
    key,
    label: value.label,
    children: (
      <div className="concept-tab-body">
        <Typography.Paragraph>{copy.conceptIntro}</Typography.Paragraph>
        <ul className="concept-list">
          {value.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    ),
  }));

  const sidebarNode = (
    <Sidebar
      locale={locale}
      title={copy.appTitle}
      subtitle={copy.focusSubtitle}
      stageItems={stageItems}
      activeStage={stage}
      activeCategory={safeCategory}
      stats={sidebarStats}
      history={history}
      completionPercent={completionPercent}
      onRouteChange={handleRouteChange}
      onOpenConcept={() => setShowConceptDialog(true)}
      onOpenInsights={() => setShowInsightsDialog(true)}
      onOpenProfile={() => setShowProfileDialog(true)}
      onOpenImport={() => setShowImportDialog(true)}
    />
  );

  return (
    <ConfigProvider theme={antThemeConfig}>
      {contextHolder}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        style={{ display: "none" }}
        onChange={handleImportFile}
      />

      <Layout className="app-shell">
        {isDesktop ? (
          <Sider width={312} className="app-sider">
            {sidebarNode}
          </Sider>
        ) : null}

        <Layout className="app-main-layout">
          <Header className="app-header">
            <div className="app-header-left">
              {!isDesktop ? (
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setMobileNavOpen(true)}
                />
              ) : null}

              <div className="app-header-copy">
                <Typography.Title level={4}>{copy.appTitle}</Typography.Title>
                <Typography.Paragraph>{stageHelper}</Typography.Paragraph>
              </div>
            </div>

            <div className="app-header-actions">
              <Segmented
                value={locale}
                onChange={(value) => setLocale(value)}
                options={[
                  { label: "VI", value: "vi" },
                  { label: "EN", value: "en" },
                ]}
              />

              {screens.md ? (
                <Space size={8} wrap>
                  <Button
                    icon={<BulbOutlined />}
                    onClick={() => setShowConceptDialog(true)}
                  >
                    {copy.concept}
                  </Button>
                  <Button
                    icon={<ClockCircleOutlined />}
                    onClick={() => setShowInsightsDialog(true)}
                  >
                    {copy.progress}
                  </Button>
                  <Button
                    icon={<ImportOutlined />}
                    onClick={() => setShowImportDialog(true)}
                  >
                    {feature.importOpen}
                  </Button>
                  <Button
                    icon={<SettingOutlined />}
                    onClick={() => setShowProfileDialog(true)}
                  >
                    {copy.learningSetup}
                  </Button>
                </Space>
              ) : null}

              <Switch
                checked={mode === "dark"}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                onChange={(checked) => setMode(checked ? "dark" : "light")}
              />
            </div>
          </Header>

          <Content className="app-content">
            <Card className="session-hero">
              <div className="session-hero-top">
                <div className="session-hero-copy">
                  <Space size={[8, 8]} wrap className="session-hero-chip-row">
                    <Tag color="gold">{stageLabel}</Tag>
                    <Tag
                      color={
                        practiceMode === "mission"
                          ? "geekblue"
                          : practiceMode === "weak"
                            ? "volcano"
                            : "default"
                      }
                    >
                      {practiceMode === "mission"
                        ? feature.mission
                        : practiceMode === "weak"
                          ? feature.weak
                          : feature.standard}
                    </Tag>
                  </Space>
                  <Typography.Title level={2}>{sessionTitle}</Typography.Title>
                  <Typography.Paragraph>{sessionDescription}</Typography.Paragraph>
                </div>

                <div className="session-hero-controls">
                  <div className="session-hero-control">
                    <span>{feature.modeLabel}</span>
                    <Segmented
                      block
                      value={practiceMode}
                      options={[
                        { label: feature.standard, value: "standard" },
                        {
                          label: `${feature.weak}${weakPreviewCount ? ` (${weakPreviewCount})` : ""}`,
                          value: "weak",
                        },
                        { label: feature.mission, value: "mission" },
                      ]}
                      onChange={handleModeChange}
                    />
                  </div>
                  <div className="session-hero-control">
                    <span>{copy.category}</span>
                    <Select
                      value={safeCategory}
                      options={deckSelectOptions}
                      disabled={practiceMode === "mission"}
                      onChange={(value) => setCategory(value)}
                    />
                  </div>
                  <Tag className="session-hero-direction">{`${copy.direction}: ${directionLabel}`}</Tag>
                </div>
              </div>

              {practiceMode === "mission" ? (
                <Card className="session-mode-card" size="small">
                  <div className="session-mode-card-top">
                    <div>
                      <Typography.Title level={5}>
                        {feature.missionTitle}: {getLocalized(todayMission.title, locale)}
                      </Typography.Title>
                      <Typography.Paragraph>
                        {getLocalized(todayMission.summary, locale)}
                      </Typography.Paragraph>
                    </div>
                    <div className="session-mode-card-stats">
                      <Tag color="blue">
                        {feature.missionGoal}: {todayMission.goal}
                      </Tag>
                      <Tag color="green">
                        {feature.missionProgress}: {missionSolvedCount}/{missionDeck.length}
                      </Tag>
                    </div>
                  </div>
                  <Progress percent={missionProgressPercent} showInfo={false} />
                </Card>
              ) : null}

              {practiceMode === "weak" ? (
                <Alert
                  className="session-mode-alert"
                  type="warning"
                  showIcon
                  message={feature.weakTitle}
                  description={feature.weakDescription}
                />
              ) : null}

              <div className="session-loop">
                <div className="session-loop-title">{copy.coachLoopTitle}</div>
                <Steps
                  current={reviewResult ? 3 : 1}
                  responsive
                  size="small"
                  items={copy.coachLoop.map((item) => ({ title: item }))}
                />
              </div>
            </Card>

            <div className="study-workspace">
              <div className="study-workspace-card">
                <Flashcard
                  locale={locale}
                  prompt={currentPrompt}
                  phonetic={currentWord?.phonetic}
                  audio={currentWord?.audio}
                  studyMode={studyMode}
                  stageLabel={stageLabel}
                  categoryLabel={
                    practiceMode === "mission"
                      ? getLocalized(todayMission.title, locale)
                      : getLocalized(activeCategory.label, locale)
                  }
                  imageHint={currentWord?.imageHint}
                  scene={currentWord?.scene}
                  partOfSpeech={
                    currentWord?.partOfSpeech
                      ? getLocalized(posLabels[currentWord.partOfSpeech], locale)
                      : ""
                  }
                  grammarTag={
                    currentWord?.grammarTag
                      ? getLocalized(currentWord.grammarTag, locale)
                      : ""
                  }
                  learnerHint={currentWord?.learnerHint}
                  emptyText={
                    practiceMode === "mission"
                      ? feature.missionCompleted
                      : practiceMode === "weak"
                        ? feature.noWeakCards
                        : copy.noDeck
                  }
                  meta={{
                    level: currentCard?.level ?? 0,
                    dueAt: currentCard?.dueAt,
                    weak: currentCard?.weakScore >= 2,
                  }}
                  speechText={currentSpeechText}
                  frequencyMeta={
                    currentWord?.frequency
                      ? getFrequencyMeta(currentWord.frequency, locale)
                      : null
                  }
                  modeBadge={
                    practiceMode === "mission"
                      ? feature.mission
                      : practiceMode === "weak"
                        ? feature.weak
                        : undefined
                  }
                />
              </div>

              <div className="study-workspace-answer">
                <QuizForm
                  locale={locale}
                  cardKey={`${activeDeckKey}:${currentWord?.word || "empty"}:${studyMode}:${practiceMode}`}
                  answer={answerBundle.primary}
                  acceptedAnswers={answerBundle.accepted}
                  alternatives={answerBundle.alternatives}
                  label={studyMode === "en-to-vi" ? copy.answerVi : copy.answerEn}
                  onSubmit={handleReviewSubmit}
                  onContinue={handleContinue}
                  assistantHint={focusHint}
                  learnerHint={currentWord?.learnerHint}
                  enableSpeech={effectiveStage === "speaking"}
                  evaluation={reviewResult}
                  examples={currentExamples}
                  submitLabel={
                    effectiveStage === "shadowing"
                      ? locale === "vi"
                        ? "Đã nhại xong"
                        : "Done shadowing"
                      : locale === "vi"
                        ? "Kiểm tra"
                        : "Check"
                  }
                />
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>

      <Drawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        placement="left"
        width={312}
        className="app-drawer"
      >
        {sidebarNode}
      </Drawer>

      <Modal
        open={showConceptDialog}
        title={copy.conceptTitle}
        onCancel={() => setShowConceptDialog(false)}
        footer={[
          <Button key="close" onClick={() => setShowConceptDialog(false)}>
            {copy.close}
          </Button>,
        ]}
        width={860}
      >
        <Tabs items={conceptTabItems} />
      </Modal>

      <Modal
        open={showInsightsDialog}
        title={copy.roadmapTitle}
        onCancel={() => setShowInsightsDialog(false)}
        footer={[
          <Button key="close" onClick={() => setShowInsightsDialog(false)}>
            {copy.close}
          </Button>,
        ]}
        width={760}
      >
        <div className="modal-stat-grid">
          {[
            { label: copy.today, value: `${todayProgress.words}/${goals.dailyWords}` },
            { label: copy.accuracy, value: `${accuracyValue}%` },
            { label: copy.due, value: `${srsMeta.due}` },
            { label: feature.weakCount, value: `${srsMeta.weak}` },
          ].map((item) => (
            <Card key={item.label} size="small">
              <Typography.Text type="secondary">{item.label}</Typography.Text>
              <Typography.Title level={3}>{item.value}</Typography.Title>
            </Card>
          ))}
        </div>

        <Card className="modal-list-card" size="small">
          <Typography.Title level={5}>{copy.recentTitle}</Typography.Title>
          {history.length === 0 ? (
            <Typography.Paragraph>{copy.noHistory}</Typography.Paragraph>
          ) : (
            <ul className="concept-list">
              {history.slice(0, 8).map((item, index) => (
                <li key={`${item.word}-${index}`}>
                  {(item.correct ? copy.historyCorrect : copy.historyWrong) +
                    ` • ${item.word} • ${item.timeTaken}s`}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="modal-list-card" size="small">
          <Typography.Title level={5}>Roadmap</Typography.Title>
          <ul className="concept-list">
            {copy.roadmap.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </Modal>

      <Modal
        open={showImportDialog}
        title={feature.importTitle}
        onCancel={() => setShowImportDialog(false)}
        footer={[
          hasImportedDecks ? (
            <Button key="clear" danger onClick={handleClearImported}>
              {feature.importClear}
            </Button>
          ) : null,
          <Button key="close" onClick={() => setShowImportDialog(false)}>
            {copy.close}
          </Button>,
          <Button
            key="choose"
            type="primary"
            icon={<ImportOutlined />}
            onClick={() => fileInputRef.current?.click()}
          >
            {feature.importOpen}
          </Button>,
        ]}
        width={760}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Alert
            type="info"
            showIcon
            message={feature.importHint}
            description={
              <Space direction="vertical" size={6}>
                <Typography.Text>{feature.importedHint}</Typography.Text>
                <Typography.Text code>
                  section,word,meaning,phonetic,partOfSpeech,frequency,alternativesEn,alternativesVi,learnerHint,examples
                </Typography.Text>
              </Space>
            }
          />

          <div className="import-control-row">
            <Space direction="vertical" size={8}>
              <Typography.Text strong>
                {locale === "vi" ? "Cách gộp dữ liệu" : "Merge strategy"}
              </Typography.Text>
              <Radio.Group
                value={importStrategy}
                onChange={(event) => setImportStrategy(event.target.value)}
              >
                <Radio.Button value="append">{feature.importAppend}</Radio.Button>
                <Radio.Button value="replace">{feature.importReplace}</Radio.Button>
              </Radio.Group>
            </Space>

            <Card size="small" className="modal-list-card">
              <Typography.Text type="secondary">
                {locale === "vi" ? "CSV ví dụ" : "CSV sample"}
              </Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0, marginTop: 8 }}>
                <Typography.Text code>
                  vocabulary,server,máy chủ,/ˈsɜː.vər/,noun,high,host|machine,,Máy chạy dịch vụ,The
                  server is stable=&gt;Máy chủ đang ổn định
                </Typography.Text>
              </Typography.Paragraph>
            </Card>
          </div>

          <div className="modal-stat-grid import-summary-grid">
            <Card size="small">
              <Typography.Text type="secondary">{feature.importVocab}</Typography.Text>
              <Typography.Title level={3}>{importedDecks.vocabulary.length}</Typography.Title>
            </Card>
            <Card size="small">
              <Typography.Text type="secondary">{feature.importPhrases}</Typography.Text>
              <Typography.Title level={3}>{importedDecks.phrases.length}</Typography.Title>
            </Card>
            <Card size="small">
              <Typography.Text type="secondary">{feature.importSources}</Typography.Text>
              <Typography.Title level={3}>
                {importedDecks.meta?.sources?.length || 0}
              </Typography.Title>
            </Card>
            <Card size="small">
              <Typography.Text type="secondary">
                {locale === "vi" ? "Lần import gần nhất" : "Last imported"}
              </Typography.Text>
              <Typography.Title level={5}>{importedAtLabel}</Typography.Title>
            </Card>
          </div>

          {importReport ? (
            <Card className="modal-list-card" size="small">
              <Typography.Title level={5}>{feature.importSummary}</Typography.Title>
              <Space direction="vertical" size={4}>
                <Typography.Text>
                  {locale === "vi" ? "File" : "File"}: <strong>{importReport.fileName}</strong>
                </Typography.Text>
                <Typography.Text>
                  {feature.importVocab}: <strong>{importReport.vocabulary}</strong>
                </Typography.Text>
                <Typography.Text>
                  {feature.importPhrases}: <strong>{importReport.phrases}</strong>
                </Typography.Text>
                <Typography.Text>
                  {locale === "vi" ? "Tổng số thẻ" : "Total cards"}:{" "}
                  <strong>{importReport.total}</strong>
                </Typography.Text>
              </Space>
            </Card>
          ) : null}

          {importedDecks.meta?.sources?.length ? (
            <Card className="modal-list-card" size="small">
              <Typography.Title level={5}>{feature.importSources}</Typography.Title>
              <Space size={[8, 8]} wrap className="import-source-list">
                {importedDecks.meta.sources.map((source) => (
                  <Tag key={source}>{source}</Tag>
                ))}
              </Space>
            </Card>
          ) : null}
        </Space>
      </Modal>

      <Modal
        open={showProfileDialog}
        title={copy.profileTitle}
        onCancel={() => setShowProfileDialog(false)}
        footer={[
          <Button key="later" onClick={() => setShowProfileDialog(false)}>
            {copy.later}
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveProfile}>
            {copy.save}
          </Button>,
        ]}
        width={620}
      >
        <Form layout="vertical">
          <Form.Item label={copy.dailyMinutes}>
            <Select
              value={draftProfile.dailyMinutes}
              options={Object.entries(copy.profileOptions.dailyMinutes).map(
                ([value, label]) => ({
                  value,
                  label,
                })
              )}
              onChange={(value) =>
                setDraftProfile((previous) => ({
                  ...previous,
                  dailyMinutes: value,
                }))
              }
            />
          </Form.Item>

          <Form.Item label={copy.biggestPain}>
            <Select
              value={draftProfile.focusPain}
              options={Object.entries(copy.profileOptions.focusPain).map(
                ([value, label]) => ({
                  value,
                  label,
                })
              )}
              onChange={(value) =>
                setDraftProfile((previous) => ({
                  ...previous,
                  focusPain: value,
                }))
              }
            />
          </Form.Item>

          <Form.Item label={copy.memoryStyle}>
            <Select
              value={draftProfile.memoryStyle}
              options={Object.entries(copy.profileOptions.memoryStyle).map(
                ([value, label]) => ({
                  value,
                  label,
                })
              )}
              onChange={(value) =>
                setDraftProfile((previous) => ({
                  ...previous,
                  memoryStyle: value,
                }))
              }
            />
          </Form.Item>

          <Form.Item label={copy.preferredTrack}>
            <Select
              value={draftProfile.preferredTrack}
              options={categories
                .filter(
                  (item) =>
                    item.section === "vocabulary" && item.key !== "importedvocab"
                )
                .map((item) => ({
                  value: item.key,
                  label: `${item.emoji} ${getLocalized(item.label, locale)}`,
                }))}
              onChange={(value) =>
                setDraftProfile((previous) => ({
                  ...previous,
                  preferredTrack: value,
                }))
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}

export default App;
