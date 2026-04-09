import React from "react";
import {
  AudioOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FlagOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Empty, Space, Tag, Typography } from "antd";

interface FlashcardProps {
  locale: string;
  prompt?: string;
  phonetic?: string;
  audio?: string;
  speechText?: string;
  studyMode: string;
  stageLabel?: string;
  categoryLabel?: string;
  imageHint?: string;
  scene?: string;
  partOfSpeech?: string;
  grammarTag?: string;
  learnerHint?: string;
  emptyText?: string;
  frequencyMeta?: {
    color: string;
    label: string;
  } | null;
  modeBadge?: string;
  meta?: {
    level?: number;
    dueAt?: number;
    weak?: boolean;
  };
}

const copy = {
  vi: {
    currentView: "Bạn đang nhìn",
    english: "Tiếng Anh",
    vietnamese: "Tiếng Việt",
    imageHint: "Gợi hình",
    level: "Level",
    due: "Lần ôn tiếp",
    dueNow: "đã đến hạn",
    ready: "sẵn sàng",
    weak: "Thẻ yếu",
  },
  en: {
    currentView: "Current view",
    english: "English",
    vietnamese: "Vietnamese",
    imageHint: "Visual cue",
    level: "Level",
    due: "Next review",
    dueNow: "due now",
    ready: "ready",
    weak: "Weak card",
  },
};

const formatDue = (dueAt?: number, locale = "vi") => {
  if (!dueAt) return locale === "vi" ? "sẵn sàng" : "ready";
  const diff = dueAt - Date.now();

  if (diff <= 0) {
    return locale === "vi" ? "đã đến hạn" : "due now";
  }

  const minutes = Math.round(diff / 60000);
  if (minutes < 60) {
    return locale === "vi" ? `${minutes} phút nữa` : `in ${minutes} min`;
  }

  const hours = Math.round(minutes / 60);
  return locale === "vi" ? `${hours} giờ nữa` : `in ${hours} hours`;
};

const speakValue = (audio?: string, value?: string) => {
  if (!value) return;

  if (audio) {
    const sound = new Audio(audio);
    sound.play().catch(() => undefined);
    return;
  }

  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
};

export default function Flashcard({
  locale,
  prompt,
  phonetic,
  audio,
  speechText,
  studyMode,
  stageLabel,
  categoryLabel,
  imageHint,
  scene,
  partOfSpeech,
  grammarTag,
  learnerHint,
  emptyText,
  frequencyMeta,
  modeBadge,
  meta,
}: FlashcardProps) {
  const t = copy[locale as "vi" | "en"] || copy.vi;

  if (!prompt) {
    return (
      <Card className="flashcard-card">
        <Empty description={emptyText} />
      </Card>
    );
  }

  return (
    <Card
      className="flashcard-card"
      title={
        <Space size={8} wrap>
          {stageLabel ? <Tag color="gold">{stageLabel}</Tag> : null}
          {categoryLabel ? <Tag>{categoryLabel}</Tag> : null}
          {modeBadge ? (
            <Tag color="geekblue" icon={<FlagOutlined />}>
              {modeBadge}
            </Tag>
          ) : null}
          {partOfSpeech ? <Tag icon={<TagOutlined />}>{partOfSpeech}</Tag> : null}
          {grammarTag ? <Tag color="purple">{grammarTag}</Tag> : null}
          {frequencyMeta ? <Tag color={frequencyMeta.color}>{frequencyMeta.label}</Tag> : null}
          {meta?.weak ? <Tag color="volcano">{t.weak}</Tag> : null}
        </Space>
      }
      extra={
        <Button
          type="text"
          shape="circle"
          icon={<AudioOutlined />}
          onClick={() => speakValue(audio, speechText || prompt)}
        />
      }
    >
      <div className="flashcard-body">
        <div className="flashcard-header">
          <Avatar className="flashcard-avatar" size={72}>
            {imageHint || "🧠"}
          </Avatar>

          <div className="flashcard-copy">
            <Space size={6} className="flashcard-eyebrow">
              <EyeOutlined />
              <span>
                {t.currentView}: {studyMode === "en-to-vi" ? t.english : t.vietnamese}
              </span>
            </Space>

            <Typography.Title level={1} className="flashcard-prompt">
              {prompt}
            </Typography.Title>

            {(phonetic || partOfSpeech || grammarTag) && (
              <Typography.Paragraph className="flashcard-meta">
                {[partOfSpeech, phonetic, grammarTag].filter(Boolean).join(" • ")}
              </Typography.Paragraph>
            )}
          </div>
        </div>

        {(scene || learnerHint) && (
          <Card className="flashcard-hint-card" size="small">
            <Typography.Text strong>{t.imageHint}:</Typography.Text>{" "}
            <Typography.Text>{scene || learnerHint}</Typography.Text>
          </Card>
        )}

        <div className="flashcard-footer">
          <Tag icon={<ClockCircleOutlined />}>
            {t.due}: {formatDue(meta?.dueAt, locale)}
          </Tag>
          <Tag>{`${t.level} ${meta?.level ?? 0}`}</Tag>
        </div>
      </div>
    </Card>
  );
}
