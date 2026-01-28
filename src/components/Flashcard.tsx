import React, { useState } from "react";
import styles from "../styles/Flashcard.module.scss";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { IconButton, Typography, Box } from "@mui/material";

interface FlashcardProps {
  word: string;
  phonetic?: string;
  audio?: string;
  showDetail: boolean;
  meta?: {
    level?: number;
    dueAt?: number;
  };
}

const Flashcard: React.FC<FlashcardProps> = ({
  word,
  phonetic,
  audio,
  showDetail,
  meta,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Phát âm toàn bộ từ
  const speakWord = () => {
    if (audio) {
      const sound = new Audio(audio);
      sound.play();
    } else if ("speechSynthesis" in window) {
      const utterance = new window.SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Phát âm từng âm tiết của phiên âm
  const speakPhonetic = (phoneticStr: string) => {
    if (!phoneticStr) return;
    const phonemes = phoneticStr.trim().split(/\s+/); // tách theo khoảng trắng
    let i = 0;

    function playNext() {
      if (i >= phonemes.length) return;
      const utterance = new SpeechSynthesisUtterance(phonemes[i]);
      utterance.lang = "en-US";
      utterance.onend = () => {
        i++;
        playNext();
      };
      window.speechSynthesis.speak(utterance);
    }
    playNext();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (!showDetail) {
    return (
      <Box
        className={styles.Flashcard}
        sx={{
          opacity: 0.5,
          fontStyle: "italic",
          color: "#999",
          minWidth: 300,
          minHeight: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" align="center">
          Input your answer to see the vocabulary details
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className={`${styles.Flashcard} ${isFlipped ? styles.flipped : ""}`}
      onClick={handleFlip}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography variant="h2" className={styles.word} fontWeight={900}>
          {word}
        </Typography>
        <IconButton onClick={speakWord} size="large" aria-label="Phát âm từ">
          <VolumeUpIcon sx={{ fontSize: "2rem", color: "#43e97b" }} />
        </IconButton>
      </Box>

      {phonetic && (
        <Box
          sx={{
            input: {
              color: "#c3ffe1",
              fontWeight: 600,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography
            className={styles.phonetic}
            variant="h5"
            fontWeight={600}
            mb={2}
          >
            {phonetic}
          </Typography>
          <IconButton
            onClick={() => speakPhonetic(phonetic)}
            size="medium"
            aria-label="Phát âm phiên âm"
          >
            <VolumeUpIcon sx={{ fontSize: "1.5rem", color: "#43e97b" }} />
          </IconButton>
        </Box>
      )}

      {(meta?.level !== undefined || meta?.dueAt) && (
        <Typography
          variant="body2"
          sx={{ mt: 1.5, opacity: 0.75, textAlign: "center" }}
        >
          Level: {meta?.level ?? 0}
          {meta?.dueAt ? ` · Next review: ${new Date(meta.dueAt).toLocaleString()}` : ""}
        </Typography>
      )}
    </Box>
  );
};

export default Flashcard;
