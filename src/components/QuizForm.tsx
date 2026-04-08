import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

interface QuizFormProps {
  locale: string;
  answer: string;
  acceptedAnswers?: string[];
  alternatives?: string[];
  label: string;
  onNext: (isCorrect: boolean) => void;
  onShowDetail: (show: boolean) => void;
  assistantHint?: string;
  submitLabel?: string;
  learnerHint?: string;
  enableSpeech?: boolean;
}

const copy = {
  vi: {
    relaxedTyping: "Cho phép gõ không dấu và chấp nhận nhiều cách trả lời đúng.",
    correctTitle: "Đúng rồi",
    wrongTitle: "Chưa đúng",
    correctBody: "Nhìn nhanh đáp án để khóa trí nhớ rồi sang thẻ tiếp theo.",
    wrongBody: "Nhìn thẳng đáp án đúng, cách nói khác và mẹo nhớ ở đây.",
    inputLabel: "Nhập đáp án",
    startVoice: "Bật mic",
    stopVoice: "Dừng mic",
    voiceReady: "Bạn có thể bấm mic rồi nói câu tiếng Anh của mình.",
    voiceListening: "Đang nghe bạn nói...",
    voiceCaptured: "Đã thu giọng nói, bạn có thể sửa nhanh rồi kiểm tra.",
    voiceUnsupported: "Trình duyệt này chưa hỗ trợ thu giọng bằng Web Speech API.",
    voiceError: "Mic chưa thu được câu rõ ràng. Thử nói chậm hơn một lần nữa.",
    yourAnswer: "Bạn đã gõ",
    correctAnswer: "Đáp án đúng",
    alternatives: "Cũng chấp nhận",
    memoryTip: "Gợi ý nhớ",
    continue: "Sang thẻ tiếp",
    answerFirst: "Nhập xong rồi mới mở đáp án.",
    tryAgainHint: "Sửa đáp án rồi bấm Kiểm tra lại.",
  },
  en: {
    relaxedTyping: "Accent-free typing and alternative correct answers are accepted.",
    correctTitle: "Correct",
    wrongTitle: "Not yet",
    correctBody: "Glance at the answer, lock it in, then move on.",
    wrongBody: "Focus on the correct answer, alternatives, and memory tip.",
    inputLabel: "Your answer",
    startVoice: "Start mic",
    stopVoice: "Stop mic",
    voiceReady: "Tap the mic and say the English sentence out loud.",
    voiceListening: "Listening...",
    voiceCaptured: "Voice captured. Edit it if needed, then check.",
    voiceUnsupported: "This browser does not support Web Speech API input.",
    voiceError: "The mic did not catch a clear sentence. Try again slowly.",
    yourAnswer: "You typed",
    correctAnswer: "Correct answer",
    alternatives: "Also accepted",
    memoryTip: "Memory tip",
    continue: "Next card",
    answerFirst: "Type your answer before revealing it.",
    tryAgainHint: "Edit your answer and press Check again.",
  },
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/gi, "d")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const QuizForm: React.FC<QuizFormProps> = ({
  locale,
  answer,
  acceptedAnswers,
  alternatives,
  label,
  onNext,
  onShowDetail,
  assistantHint,
  submitLabel,
  learnerHint,
  enableSpeech = false,
}) => {
  const theme = useTheme();
  const t = copy[locale as "vi" | "en"] || copy.vi;
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [submittedValue, setSubmittedValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState<null | boolean>(enableSpeech ? null : false);
  const [speechStatus, setSpeechStatus] = useState("");

  useEffect(() => {
    setInput("");
    setResult(null);
    setSubmittedValue("");
    setIsRecording(false);
    setSpeechStatus(enableSpeech ? t.voiceReady : "");
    onShowDetail(false);
    recognitionRef.current?.stop?.();
    inputRef.current?.focus();
  }, [answer, enableSpeech, onShowDetail, t.voiceReady]);

  useEffect(() => {
    if (!enableSpeech || typeof window === "undefined") {
      setSpeechSupported(false);
      recognitionRef.current?.stop?.();
      recognitionRef.current = null;
      return undefined;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: any;
      webkitSpeechRecognition?: any;
    };
    const SpeechRecognitionCtor =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setSpeechSupported(false);
      return undefined;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsRecording(true);
      setSpeechStatus(t.voiceListening);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results || [])
        .map((item: any) => item[0]?.transcript || "")
        .join(" ")
        .trim();

      if (transcript) {
        setInput(transcript);
        setSpeechStatus(t.voiceCaptured);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setSpeechStatus(t.voiceError);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    setSpeechSupported(true);

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [enableSpeech, locale, t.voiceCaptured, t.voiceError, t.voiceListening]);

  const checkAnswer = () => {
    const normalizedInput = normalize(input);
    const pool = (acceptedAnswers?.length ? acceptedAnswers : [answer]).map(normalize);
    const isCorrect = pool.includes(normalizedInput);

    onShowDetail(true);
    if (isCorrect) {
      onNext(true);
      return;
    }
    setSubmittedValue(input.trim());
    setResult(false);
  };

  const toggleRecording = () => {
    if (speechSupported !== true || result === true) return;

    if (isRecording) {
      recognitionRef.current?.stop?.();
      setSpeechStatus(t.voiceReady);
      return;
    }

    try {
      recognitionRef.current?.start?.();
      inputRef.current?.focus();
    } catch {
      setSpeechStatus(t.voiceError);
    }
  };

  const helperText =
    result === null
      ? speechStatus || assistantHint || t.relaxedTyping
      : t.wrongBody;

  const helperColor =
    result === null ? theme.palette.text.secondary : theme.palette.secondary.main;

  const wrongTone = {
    bg: alpha(theme.palette.secondary.main, 0.12),
    border: alpha(theme.palette.secondary.main, 0.22),
    icon: <CancelRoundedIcon fontSize="small" />,
  };

  return (
    <Box
      sx={{
        borderRadius: 4,
        p: { xs: 1.2, md: 1.35 },
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.text.primary, 0.03)
            : "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,250,243,0.92))",
        border: "none",
        boxShadow: "none",
      }}
    >
      <Stack spacing={1.1}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.35,
                color: theme.palette.text.secondary,
                fontWeight: 800,
                letterSpacing: "0.04em",
              }}
            >
              {t.inputLabel}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: helperColor,
                lineHeight: 1.45,
                fontWeight: result === null ? 500 : 700,
              }}
            >
              {helperText}
            </Typography>
          </Box>

          {enableSpeech && (
            <Button
              variant={isRecording ? "contained" : "outlined"}
              size="small"
              onClick={toggleRecording}
              disabled={speechSupported !== true || result === true}
              startIcon={isRecording ? <StopRoundedIcon /> : <MicRoundedIcon />}
              sx={{
                minWidth: 124,
                borderRadius: 999,
                alignSelf: { xs: "stretch", sm: "center" },
              }}
            >
              {isRecording ? t.stopVoice : t.startVoice}
            </Button>
          )}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="stretch">
          <TextField
            inputRef={inputRef}
            variant="filled"
            placeholder={label}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              if (input.trim()) checkAnswer();
            }}
            fullWidth
            size="small"
            disabled={result === true}
            InputProps={{ disableUnderline: true }}
            sx={{
              "& .MuiFilledInput-root": {
                borderRadius: 999,
                overflow: "hidden",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.04)
                    : alpha("#0b0f0f", 0.04),
                border: "none",
                boxShadow: "none",
                transition: "all 0.18s ease",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.06)
                      : alpha("#0b0f0f", 0.055),
                  boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.08)}`,
                },
                "&.Mui-focused": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.07)
                      : alpha("#0b0f0f", 0.06),
                  boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.12)}`,
                  borderColor: alpha(theme.palette.primary.main, 0.35),
                },
                "&.Mui-disabled": {
                  opacity: 0.85,
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "0.98rem",
                py: 1.05,
              },
              "& .MuiInputBase-input::placeholder": {
                color: alpha(theme.palette.text.secondary, 0.9),
                opacity: 1,
              },
            }}
          />

          {enableSpeech && (
            <IconButton
              onClick={toggleRecording}
              disabled={speechSupported !== true || result === true}
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                bgcolor: isRecording ? alpha(theme.palette.secondary.main, 0.14) : alpha(theme.palette.primary.main, 0.08),
                color: isRecording ? theme.palette.secondary.main : theme.palette.primary.main,
                flexShrink: 0,
              }}
            >
              {isRecording ? <RadioButtonCheckedRoundedIcon /> : <MicRoundedIcon />}
            </IconButton>
          )}
        </Stack>

        {enableSpeech && speechSupported === false && (
          <Typography variant="body2" color="text.secondary">
            {t.voiceUnsupported}
          </Typography>
        )}

        {result === false && (
          <Box
            sx={{
              borderRadius: 4,
              p: 1.2,
              bgcolor: wrongTone.bg,
              border: `1px solid ${wrongTone.border}`,
            }}
          >
            <Stack spacing={0.8}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: alpha(theme.palette.background.paper, 0.72),
                    color: theme.palette.secondary.main,
                    flexShrink: 0,
                  }}
                >
                  {wrongTone.icon}
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>
                  {t.wrongTitle}
                </Typography>
              </Stack>

              {submittedValue && (
                <Typography variant="body2" color="text.secondary">
                  {t.yourAnswer}: {submittedValue}
                </Typography>
              )}

              <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.5 }}>
                {t.correctAnswer}: {answer}
              </Typography>

              {alternatives && alternatives.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  {t.alternatives}: {alternatives.join(", ")}
                </Typography>
              )}

              {learnerHint && (
                <Typography variant="body2" color="text.secondary">
                  {t.memoryTip}: {learnerHint}
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {(result === null || result === false) && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.45 }}>
              {result === false ? t.tryAgainHint : assistantHint || t.answerFirst}
            </Typography>
            <Button
              variant="contained"
              onClick={checkAnswer}
              disabled={!input.trim()}
              size="small"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                px: 2.1,
                borderRadius: 999,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #7fe4b5, #56c98f)"
                    : "linear-gradient(135deg, #2d7163, #4d9b88)",
                color: theme.palette.mode === "dark" ? "#10201a" : "#ffffff",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 10px 22px rgba(38, 153, 110, 0.18)"
                    : "0 10px 18px rgba(52, 121, 102, 0.16)",
              }}
            >
              {submitLabel || (locale === "vi" ? "Kiểm tra" : "Check")}
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default QuizForm;
