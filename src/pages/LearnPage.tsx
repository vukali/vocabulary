import React, { useState, useEffect } from "react";
import { shuffle } from "../utils/shuffle";
import QuizForm from "../components/QuizForm";
import { Box, LinearProgress, Typography } from "@mui/material";

type Vocab = {
  word: string;
  meaning: string;
  phonetic: string;
  audio: string;
};

const DAILY_COUNT = 20;

const LearnPage: React.FC = () => {
  const [words, setWords] = useState<Vocab[]>([]);
  const [idx, setIdx] = useState(0);
  const [lang, setLang] = useState<"en" | "vi">("en");

  useEffect(() => {
    fetch("/data/allvocab.json")
      .then((res) => res.json())
      .then((data) => {
        setWords(shuffle(data.words as Vocab[]).slice(0, DAILY_COUNT));
      })
      .catch((err) => {
        console.error("Failed to load vocab data:", err);
      });
  }, []);

  useEffect(() => {
    setLang(Math.random() > 0.5 ? "en" : "vi");
  }, [idx]);

  if (idx >= words.length) {
    return (
      <Typography align="center" mt={8}>
        Bạn đã hoàn thành {words.length} từ hôm nay!
      </Typography>
    );
  }

  const w = words[idx];
  const question = lang === "en" ? w.word : w.meaning;
  const answer = lang === "en" ? w.meaning : w.word;
  const label = lang === "en" ? "Nghĩa tiếng Việt?" : "English?";

  return (
    <Box
      minHeight="100vh"
      minWidth="100vw"
      bgcolor="#f6f9fc"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box width={400} maxWidth="90vw">
        <QuizForm
          question={question}
          answer={answer}
          label={label}
          onNext={() => setIdx(idx + 1)}
          onShowDetail={() => console.log(`Details for: ${question}`)}
        />
        <Box mt={3}>
          <LinearProgress
            variant="determinate"
            value={((idx + 1) / words.length) * 100}
          />
          <Typography align="center" mt={1}>
            {idx + 1}/{words.length} từ hôm nay
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LearnPage;
