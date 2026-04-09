import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Input,
  type InputRef,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  ArrowRightOutlined,
  AudioOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  type BrowserSpeechRecognition,
  extractTranscript,
  getSpeechRecognitionCtor,
} from "../utils/speech";

interface ReviewResult {
  isCorrect: boolean;
  submittedValue: string;
  timeTaken: number;
}

interface ExampleLine {
  en: string;
  vi?: string;
}

interface QuizFormProps {
  locale: string;
  cardKey: string;
  answer: string;
  acceptedAnswers?: string[];
  alternatives?: string[];
  label: string;
  onSubmit: (payload: { isCorrect: boolean; submittedValue: string }) => void;
  onContinue: () => void;
  assistantHint?: string;
  submitLabel?: string;
  learnerHint?: string;
  enableSpeech?: boolean;
  evaluation: ReviewResult | null;
  examples?: ExampleLine[];
}

const copy = {
  vi: {
    typingHelp:
      "Cho phép gõ không dấu và chấp nhận nhiều cách trả lời đúng gần nhau.",
    answerPanel: "Trả lời ngay",
    inputLabel: "Câu trả lời của bạn",
    startVoice: "Nói",
    stopVoice: "Dừng",
    listening: "Đang nghe bạn nói...",
    captured: "Đã thu giọng. Bạn có thể sửa nhanh rồi kiểm tra.",
    unsupported: "Trình duyệt này chưa hỗ trợ thu giọng bằng Web Speech API.",
    voiceError: "Mic chưa bắt rõ câu. Hãy nói chậm và rõ hơn.",
    reviewSaved: "Lần chấm đầu đã được lưu vào vòng ôn.",
    correctTitle: "Đúng rồi",
    wrongTitle: "Chưa đúng",
    correctBody: "Khóa đáp án này vào trí nhớ rồi sang thẻ tiếp.",
    wrongBody: "Đáp án đúng đã nằm ngay bên trên. Nhìn nhanh, gõ lại ngay trong ô dưới.",
    retrySuccessTitle: "Đã sửa đúng",
    retrySuccessBody:
      "Bạn vừa khóa lại đáp án bằng lần gõ lại. Sang thẻ tiếp hoặc nhìn nhanh ví dụ.",
    retryWrongTitle: "Vẫn chưa đúng",
    retryWrongBody:
      "Nhìn đáp án, gõ lại thêm một lần nữa hoặc bỏ qua để sang thẻ tiếp.",
    autoNext: "Tự chuyển sang thẻ tiếp theo...",
    yourAnswer: "Lần đầu bạn gõ",
    retryAnswer: "Lần gõ lại",
    correctAnswer: "Đáp án đúng",
    alternatives: "Cũng chấp nhận",
    memoryTip: "Gợi ý nhớ",
    examples: "Câu nhớ nhanh",
    retry: "Nhập lại ngay",
    skip: "Bỏ qua thẻ này",
    next: "Sang thẻ tiếp",
    blank: "Bạn chưa nhập gì",
  },
  en: {
    typingHelp: "Accent-free typing and close alternative answers are accepted.",
    answerPanel: "Respond now",
    inputLabel: "Your answer",
    startVoice: "Speak",
    stopVoice: "Stop",
    listening: "Listening to your voice...",
    captured: "Voice captured. Edit it if needed, then check.",
    unsupported: "This browser does not support Web Speech API input.",
    voiceError: "The mic did not catch a clear sentence. Try speaking slower.",
    reviewSaved: "Only the first scored attempt is saved into the review loop.",
    correctTitle: "Correct",
    wrongTitle: "Not yet",
    correctBody: "Lock this answer in and move to the next card.",
    wrongBody: "The correct answer is already above. Scan it once, then type again right below.",
    retrySuccessTitle: "Fixed on retry",
    retrySuccessBody:
      "You corrected the answer on the retry. Move on or scan the example once.",
    retryWrongTitle: "Still not right",
    retryWrongBody: "Look at the answer, type it once more, or skip to the next card.",
    autoNext: "Moving to the next card automatically...",
    yourAnswer: "First attempt",
    retryAnswer: "Retry attempt",
    correctAnswer: "Correct answer",
    alternatives: "Also accepted",
    memoryTip: "Memory tip",
    examples: "Quick example",
    retry: "Retry now",
    skip: "Skip this card",
    next: "Next card",
    blank: "You left it blank",
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

export default function QuizForm({
  locale,
  cardKey,
  answer,
  acceptedAnswers,
  alternatives,
  label,
  onSubmit,
  onContinue,
  assistantHint,
  submitLabel,
  learnerHint,
  enableSpeech = false,
  evaluation,
  examples = [],
}: QuizFormProps) {
  const t = copy[locale as "vi" | "en"] || copy.vi;
  const inputRef = useRef<InputRef | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechStatus, setSpeechStatus] = useState("");
  const [retryResult, setRetryResult] = useState<ReviewResult | null>(null);

  const isRetryMode = Boolean(evaluation && !evaluation.isCorrect);
  const isRecovered = Boolean(retryResult?.isCorrect);
  const isResolved = Boolean(evaluation?.isCorrect || isRecovered);
  const hasRetryMiss = Boolean(retryResult && !retryResult.isCorrect);
  const shouldAutoAdvance = Boolean(evaluation?.isCorrect || isRecovered);

  useEffect(() => {
    setInput("");
    setIsRecording(false);
    setRetryResult(null);
    setSpeechStatus(enableSpeech ? t.typingHelp : "");
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    recognitionRef.current?.stop?.();
    inputRef.current?.focus();
  }, [cardKey, enableSpeech, t.typingHelp]);

  useEffect(() => {
    if (!evaluation?.isCorrect && evaluation) {
      setInput("");
      setIsRecording(false);
      inputRef.current?.focus();
    }
  }, [evaluation]);

  useEffect(() => {
    if (evaluation) return;
    setRetryResult(null);
  }, [evaluation]);

  useEffect(() => {
    if (hasRetryMiss) {
      setInput("");
      inputRef.current?.focus();
    }
  }, [hasRetryMiss]);

  useEffect(() => {
    if (!shouldAutoAdvance) return undefined;

    advanceTimerRef.current = window.setTimeout(() => {
      onContinue();
    }, 1100);

    return () => {
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
    };
  }, [onContinue, shouldAutoAdvance]);

  useEffect(() => {
    if (!enableSpeech || typeof window === "undefined") {
      setSpeechSupported(false);
      recognitionRef.current?.stop?.();
      recognitionRef.current = null;
      return undefined;
    }

    const SpeechRecognitionCtor = getSpeechRecognitionCtor(window);

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
      setSpeechStatus(t.listening);
    };

    recognition.onresult = (event) => {
      const transcript = extractTranscript(event);

      if (!transcript) return;

      setInput(transcript);
      setSpeechStatus(t.captured);
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
  }, [enableSpeech, t.captured, t.listening, t.voiceError]);

  const evaluateInput = () => {
    const normalizedInput = normalize(input);
    const pool = (acceptedAnswers?.length ? acceptedAnswers : [answer]).map(normalize);
    const isCorrect = pool.includes(normalizedInput);

    return {
      isCorrect,
      submittedValue: input.trim(),
    };
  };

  const handleCheck = () => {
    if (isResolved) return;

    const result = evaluateInput();

    if (!evaluation) {
      onSubmit(result);
      return;
    }

    setRetryResult({
      ...result,
      timeTaken: 0,
    });
  };

  const handleContinueNow = () => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    onContinue();
  };

  const toggleRecording = () => {
    if (!speechSupported || isResolved || isRetryMode) return;

    if (isRecording) {
      recognitionRef.current?.stop?.();
      return;
    }

    try {
      recognitionRef.current?.start?.();
      inputRef.current?.focus();
    } catch {
      setSpeechStatus(t.voiceError);
    }
  };

  const feedbackTone =
    evaluation?.isCorrect || isRecovered ? "success" : "warning";
  const feedbackIcon =
    feedbackTone === "success" ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
  const feedbackTitle = isRecovered
    ? t.retrySuccessTitle
    : hasRetryMiss
      ? t.retryWrongTitle
      : evaluation?.isCorrect
        ? t.correctTitle
        : t.wrongTitle;
  const feedbackBody = isRecovered
    ? t.retrySuccessBody
    : hasRetryMiss
      ? t.retryWrongBody
      : evaluation?.isCorrect
        ? t.correctBody
        : t.wrongBody;
  const primaryActionLabel =
    isRetryMode ? t.retry : submitLabel || (locale === "vi" ? "Kiểm tra" : "Check");
  const focusExample = examples[0];
  const firstAttemptToneClass = evaluation?.isCorrect
    ? "answer-context-item--attempt-success"
    : "answer-context-item--attempt-warning";
  const retryToneClass = retryResult?.isCorrect
    ? "answer-context-item--retry-success"
    : "answer-context-item--retry-warning";

  return (
    <Card
      className="answer-card"
      title={t.answerPanel}
      extra={
        enableSpeech && !evaluation ? (
          <Button
            icon={isRecording ? <LoadingOutlined /> : <AudioOutlined />}
            onClick={toggleRecording}
            disabled={!speechSupported}
          >
            {isRecording ? t.stopVoice : t.startVoice}
          </Button>
        ) : null
      }
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {evaluation ? (
          <div
            className={`answer-context-card ${
              feedbackTone === "success"
                ? "answer-context-card--success"
                : "answer-context-card--warning"
            }`}
          >
            <div className="answer-context-header">
              <div className="answer-context-status">
                <span className="answer-context-icon">{feedbackIcon}</span>
                <div className="answer-context-copy">
                  <Typography.Text strong>{feedbackTitle}</Typography.Text>
                  <Typography.Paragraph>{feedbackBody}</Typography.Paragraph>
                </div>
              </div>

              <div className="answer-context-actions">
                {isResolved ? (
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    onClick={handleContinueNow}
                  >
                    {t.next}
                  </Button>
                ) : (
                  <Button onClick={handleContinueNow}>{t.skip}</Button>
                )}
              </div>
            </div>

            <div className="answer-context-grid">
              <div className="answer-context-item answer-context-item--answer">
                <div className="answer-context-label">{t.correctAnswer}</div>
                <div className="answer-context-value answer-context-value--primary">
                  {answer}
                </div>
              </div>

              <div
                className={`answer-context-item answer-context-item--attempt ${firstAttemptToneClass}`}
              >
                <div className="answer-context-label">{t.yourAnswer}</div>
                <div className="answer-context-value">
                  {evaluation.submittedValue || t.blank}
                </div>
              </div>

              {retryResult ? (
                <div
                  className={`answer-context-item answer-context-item--retry ${retryToneClass}`}
                >
                  <div className="answer-context-label">{t.retryAnswer}</div>
                  <div className="answer-context-value">
                    {retryResult.submittedValue || t.blank}
                  </div>
                </div>
              ) : null}

              {learnerHint ? (
                <div className="answer-context-item answer-context-item--memory">
                  <div className="answer-context-label">{t.memoryTip}</div>
                  <div className="answer-context-value">{learnerHint}</div>
                </div>
              ) : null}
            </div>

            {alternatives && alternatives.length > 0 ? (
              <div className="answer-context-note answer-context-note--alternatives">
                <div className="answer-context-label">{t.alternatives}</div>
                <Space size={[6, 6]} wrap>
                  {alternatives.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </Space>
              </div>
            ) : null}

            {focusExample ? (
              <div className="answer-context-note answer-context-note--example">
                <div className="answer-context-label">{t.examples}</div>
                <div className="answer-context-example">
                  <Typography.Text strong>{focusExample.en}</Typography.Text>
                  {focusExample.vi ? (
                    <Typography.Paragraph>{focusExample.vi}</Typography.Paragraph>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="answer-context-footer">
              <Typography.Text type="secondary">
                {isRecovered ? t.autoNext : t.reviewSaved}
              </Typography.Text>
            </div>
          </div>
        ) : (
          <Alert
            type="info"
            showIcon
            message={assistantHint || t.typingHelp}
            description={
              enableSpeech
                ? speechSupported
                  ? speechStatus || t.typingHelp
                  : t.unsupported
                : t.typingHelp
            }
          />
        )}

        <div className="answer-input-label">{t.inputLabel}</div>

        <div className="answer-input-row">
          <Input
            ref={inputRef}
            value={input}
            size="large"
            placeholder={label}
            className="answer-input"
            onChange={(event) => setInput(event.target.value)}
            onPressEnter={handleCheck}
            disabled={isResolved}
          />

          {enableSpeech && !evaluation ? (
            <Button
              size="large"
              icon={isRecording ? <SyncOutlined spin /> : <AudioOutlined />}
              onClick={toggleRecording}
              disabled={!speechSupported}
            />
          ) : null}

          <Button
            type="primary"
            size="large"
            className="answer-submit-button"
            onClick={handleCheck}
            disabled={!input.trim() || isResolved}
          >
            {primaryActionLabel}
          </Button>
        </div>
      </Space>
    </Card>
  );
}
