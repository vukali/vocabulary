import React from "react";
import { Box, Chip, IconButton, Stack, Typography, alpha } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useTheme } from "@mui/material/styles";

interface FlashcardProps {
  locale: string;
  prompt?: string;
  answer?: string;
  phonetic?: string;
  audio?: string;
  showDetail: boolean;
  studyMode: string;
  stageLabel?: string;
  categoryLabel?: string;
  imageHint?: string;
  scene?: string;
  partOfSpeech?: string;
  grammarTag?: string;
  alternatives?: string[];
  learnerHint?: string;
  emptyText?: string;
  meta?: {
    level?: number;
    dueAt?: number;
  };
}

const copy = {
  vi: {
    lookAt: "Mắt đang nhìn",
    en: "Tiếng Anh",
    vi: "Tiếng Việt",
    imageHint: "Hình gợi nhớ",
    answer: "Đáp án đúng",
    hiddenAnswer: "...",
    alternatives: "Cũng chấp nhận",
    hint: "Mẹo nhớ",
    typeFirst: "Tự gõ đáp án trước rồi mới xem.",
    nextReview: "Thẻ này sẽ quay lại",
    ready: "sẵn sàng ôn",
    level: "Level",
  },
  en: {
    lookAt: "Current view",
    en: "English",
    vi: "Vietnamese",
    imageHint: "Image cue",
    answer: "Correct answer",
    hiddenAnswer: "...",
    alternatives: "Also accepted",
    hint: "Memory tip",
    typeFirst: "Type your answer before revealing it.",
    nextReview: "This card returns",
    ready: "ready for review",
    level: "Level",
  },
};

const formatDue = (dueAt?: number, locale = "vi") => {
  if (!dueAt) return locale === "vi" ? "sẵn sàng ôn" : "ready for review";
  const diff = dueAt - Date.now();
  if (diff <= 0) return locale === "vi" ? "đã đến hạn" : "already due";
  const minutes = Math.round(diff / 60000);
  if (minutes < 60) return locale === "vi" ? `${minutes} phút nữa` : `in ${minutes} min`;
  const hours = Math.round(minutes / 60);
  return locale === "vi" ? `${hours} giờ nữa` : `in ${hours} hours`;
};

const Flashcard: React.FC<FlashcardProps> = ({
  locale,
  prompt,
  answer,
  phonetic,
  audio,
  showDetail,
  studyMode,
  stageLabel,
  categoryLabel,
  imageHint,
  scene,
  partOfSpeech,
  grammarTag,
  alternatives,
  learnerHint,
  emptyText,
  meta,
}) => {
  const theme = useTheme();
  const t = copy[locale as "vi" | "en"] || copy.vi;

  const speakWord = () => {
    const wordToSpeak = studyMode === "en-to-vi" ? prompt : answer;
    if (!wordToSpeak) return;

    if (audio) {
      const sound = new Audio(audio);
      sound.play().catch(() => undefined);
      return;
    }

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(wordToSpeak);
      utterance.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!prompt) {
    return (
      <Box
        sx={{
          borderRadius: 4,
          p: 4,
          textAlign: "center",
          bgcolor: alpha(theme.palette.text.primary, 0.04),
        }}
      >
        <Typography color="text.secondary">{emptyText}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: 5,
        p: { xs: 1.6, md: 1.9 },
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(24, 43, 39, 0.98), rgba(15, 24, 22, 0.98))"
            : "linear-gradient(180deg, rgba(255, 251, 245, 0.99), rgba(246, 237, 222, 0.99))",
        border: "none",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 16px 30px rgba(0, 0, 0, 0.16)"
            : "0 16px 30px rgba(130, 111, 82, 0.08)",
      }}
    >
      <Stack spacing={1.35}>
        <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
          <Chip size="small" label={categoryLabel || "Flashcard"} variant="outlined" />
          {stageLabel && <Chip size="small" label={stageLabel} color="secondary" variant="outlined" />}
          {partOfSpeech && <Chip size="small" label={partOfSpeech} variant="outlined" />}
          {grammarTag && <Chip size="small" label={grammarTag} variant="outlined" />}
          <Chip size="small" label={`${t.level} ${meta?.level ?? 0}`} variant="outlined" />
        </Stack>

        <Box
          sx={{
            borderRadius: 4,
            p: { xs: 1.25, md: 1.45 },
            bgcolor:
              theme.palette.mode === "dark"
                ? alpha("#ffffff", 0.02)
                : alpha("#ffffff", 0.45),
            border: "none",
            boxShadow: "none",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.4}
            alignItems={{ xs: "flex-start", sm: "stretch" }}
            sx={{ minWidth: 0 }}
          >
            <Box
              sx={{
                width: 78,
                minWidth: 78,
                height: 78,
                borderRadius: "24px",
                display: "grid",
                placeItems: "center",
                fontSize: "2rem",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primary.main, 0.14)
                    : alpha(theme.palette.secondary.main, 0.12),
                boxShadow: "none",
              }}
            >
              {imageHint || "🧠"}
            </Box>

            <Stack spacing={0.75} sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ lineHeight: 1.2, letterSpacing: "0.08em" }}
              >
                {t.lookAt}: {studyMode === "en-to-vi" ? t.en : t.vi}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="flex-start"
                justifyContent="space-between"
                sx={{ minWidth: 0 }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: "1.75rem", md: "2.15rem" },
                    lineHeight: 1.08,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    minWidth: 0,
                    pr: 1,
                    flex: 1,
                  }}
                >
                  {prompt}
                </Typography>

                <IconButton
                  onClick={speakWord}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.18),
                    },
                  }}
                >
                  <VolumeUpIcon />
                </IconButton>
              </Stack>

              {(phonetic || partOfSpeech || grammarTag) && (
                <Typography variant="body2" color="text.secondary">
                  {[partOfSpeech, grammarTag, phonetic].filter(Boolean).join(" • ")}
                </Typography>
              )}

              {(scene || learnerHint) && (
                <Box
                  sx={{
                    borderRadius: 3,
                    px: 1,
                    py: 0.9,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.primary.main, 0.09)
                        : alpha(theme.palette.secondary.main, 0.08),
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.45, wordBreak: "break-word", overflowWrap: "anywhere" }}
                  >
                    {t.imageHint}: {scene || learnerHint}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Stack>
        </Box>

        {showDetail ? (
          <Box
            sx={{
              borderRadius: 4,
              p: 1.15,
              maxWidth: { xs: "100%", md: 560 },
              width: "100%",
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
            }}
          >
            <Typography variant="overline" color="text.secondary">
              {t.answer}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mt: 0.2,
                mb: 0.45,
                fontSize: { xs: "1rem", md: "1.05rem" },
                lineHeight: 1.45,
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                fontWeight: 700,
              }}
            >
              {answer}
            </Typography>

            {alternatives && alternatives.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.35 }}>
                {t.alternatives}: {alternatives.join(", ")}
              </Typography>
            )}

            {learnerHint && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.35 }}>
                {t.hint}: {learnerHint}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary">
              {`${t.nextReview} ${formatDue(meta?.dueAt, locale)}.`}
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ px: 0.2, lineHeight: 1.5 }}
          >
            {t.typeFirst}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Flashcard;
