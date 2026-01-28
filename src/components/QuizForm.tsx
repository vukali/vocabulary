import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/QuizForm.module.scss";
import { TextField, Button, Typography } from "@mui/material";

interface QuizFormProps {
  question: string;
  answer: string;
  label: string;
  onNext: (isCorrect: boolean) => void;
  onShowDetail: (show: boolean) => void;
}

const QuizForm: React.FC<QuizFormProps> = ({
  question,
  answer,
  label,
  onNext,
  onShowDetail,
}) => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [history, setHistory] = useState<
    { word: string; correct: boolean; timeTaken: number }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (result !== null) {
      onShowDetail(false); // truyền false để ẩn flashcard
    }
  };

  useEffect(() => {
    setInput("");
    setResult(null);
    inputRef.current?.focus();
  }, [question]);

  const checkAnswer = () => {
    const isCorrect =
      input.trim().toLowerCase() === answer.trim().toLowerCase();
    setResult(isCorrect);
    onShowDetail(true); // truyền true để hiện flashcard
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    setHistory([...history, { word: question, correct: isCorrect, timeTaken }]);
    setTimeout(() => {
      setResult(null);
      onNext(isCorrect);
    }, 1500);
  };

  const startTime = Date.now();

  return (
    <div className={styles.QuizForm}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={2}
        className={styles.question}
      >
        {question}
      </Typography>
      <TextField
        inputRef={inputRef}
        label={label}
        value={input}
        onChange={handleChange}
        onKeyDown={(e) =>
          e.key === "Enter" && input && result === null
            ? checkAnswer()
            : undefined
        }
        fullWidth
        disabled={result !== null}
        sx={{
          input: { color: "#ffffff" },
          label: { color: "#aaa" },
          "& label.Mui-focused": { color: "#fff" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#888" },
            "&.Mui-focused fieldset": { borderColor: "#fff" },
          },
        }}
      />
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={checkAnswer}
        disabled={!input || result !== null}
      >
        Check
      </Button>
      {result !== null && (
        <Typography
          className={result ? styles.resultCorrect : styles.resultWrong}
        >
          {result ? "✅ Exactly!" : `❌ Wrong! Answer: ${answer}`}
        </Typography>
      )}
      <div className={styles.history}>
        <Typography variant="h6" className={styles.historyTitle}>
          Lịch sử học
        </Typography>
        {history.map((item, index) => (
          <Typography key={index} className={styles.historyItem}>
            {item.word}: {item.correct ? "✅" : "❌"} ({item.timeTaken}s)
          </Typography>
        ))}
      </div>
    </div>
  );
};

export default QuizForm;
