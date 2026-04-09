import React, { useEffect, useMemo, useState } from "react";
import {
  BulbOutlined,
  ClockCircleOutlined,
  DeploymentUnitOutlined,
  DotChartOutlined,
  FieldTimeOutlined,
  ImportOutlined,
  MessageOutlined,
  SettingOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { Card, List, Menu, Progress, Space, Statistic, Tag, Typography } from "antd";

interface SidebarStageItem {
  key: string;
  label: string;
  helper: string;
  subItems: Array<{
    key: string;
    label: string;
    emoji?: string;
  }>;
}

interface SidebarStat {
  label: string;
  value: string;
}

interface SidebarProps {
  locale: string;
  title: string;
  subtitle: string;
  stageItems: SidebarStageItem[];
  activeStage: string;
  activeCategory: string;
  stats: SidebarStat[];
  history: { word: string; correct: boolean; timeTaken: number }[];
  completionPercent: number;
  onRouteChange: (stage: string, category: string) => void;
  onOpenConcept: () => void;
  onOpenInsights: () => void;
  onOpenProfile: () => void;
  onOpenImport: () => void;
}

const copy = {
  vi: {
    learning: "Lộ trình học",
    tools: "Điều khiển",
    recent: "Vừa học",
    empty: "Chưa có lịch sử. Hoàn thành vài thẻ đầu để sidebar hữu ích hơn.",
    concept: "Concept app",
    progress: "Tiến độ",
    setup: "Nhịp học",
    import: "Import data",
    rhythm: "Nhịp hôm nay",
  },
  en: {
    learning: "Learning flow",
    tools: "Controls",
    recent: "Recently studied",
    empty: "No history yet. Finish a few cards so the sidebar becomes useful.",
    concept: "App concept",
    progress: "Progress",
    setup: "Learning setup",
    import: "Import data",
    rhythm: "Today's rhythm",
  },
};

const stageIcons: Record<string, React.ReactNode> = {
  vocabulary: <MessageOutlined />,
  phrases: <DeploymentUnitOutlined />,
  tenses: <FieldTimeOutlined />,
  shadowing: <SoundOutlined />,
  speaking: <DotChartOutlined />,
};

export default function Sidebar({
  locale,
  title,
  subtitle,
  stageItems,
  activeStage,
  activeCategory,
  stats,
  history,
  completionPercent,
  onRouteChange,
  onOpenConcept,
  onOpenInsights,
  onOpenProfile,
  onOpenImport,
}: SidebarProps) {
  const t = copy[locale as "vi" | "en"] || copy.vi;
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const learningItems = useMemo(
    () =>
      stageItems.map((item) => {
        if (item.subItems.length > 1) {
          return {
            key: `group:${item.key}`,
            icon: stageIcons[item.key],
            label: item.label,
            children: item.subItems.map((subItem) => ({
              key: `route:${item.key}:${subItem.key}`,
              label: (
                <span className="sidebar-menu-label">
                  <span>{subItem.emoji || "•"}</span>
                  <span>{subItem.label}</span>
                </span>
              ),
            })),
          };
        }

        const firstSubItem = item.subItems[0];
        return {
          key: `route:${item.key}:${firstSubItem?.key || item.key}`,
          icon: stageIcons[item.key],
          label: item.label,
        };
      }),
    [stageItems]
  );

  const actionItems = useMemo(
    () => [
      {
        key: "action:concept",
        icon: <BulbOutlined />,
        label: t.concept,
      },
      {
        key: "action:progress",
        icon: <ClockCircleOutlined />,
        label: t.progress,
      },
      {
        key: "action:setup",
        icon: <SettingOutlined />,
        label: t.setup,
      },
      {
        key: "action:import",
        icon: <ImportOutlined />,
        label: t.import,
      },
    ],
    [t.concept, t.import, t.progress, t.setup]
  );

  const selectedKey = `route:${activeStage}:${activeCategory}`;

  useEffect(() => {
    const activeGroup = stageItems.find(
      (item) => item.key === activeStage && item.subItems.length > 1
    );

    if (!activeGroup) return;
    setOpenKeys((previous) => {
      const key = `group:${activeGroup.key}`;
      return previous.includes(key) ? previous : [key];
    });
  }, [activeStage, stageItems]);

  return (
    <div className="sidebar-shell">
      <div className="sidebar-brand">
        <Typography.Title level={3}>{title}</Typography.Title>
        <Typography.Paragraph>{subtitle}</Typography.Paragraph>
      </div>

      <Card className="sidebar-card" size="small">
        <Space direction="vertical" size={14} style={{ width: "100%" }}>
          <div>
            <Typography.Text type="secondary">{t.rhythm}</Typography.Text>
            <Progress
              percent={completionPercent}
              showInfo={false}
              strokeLinecap="round"
            />
          </div>

          <div className="sidebar-stat-grid">
            {stats.map((item) => (
              <div key={item.label} className="sidebar-stat-tile">
                <Statistic title={item.label} value={item.value} />
              </div>
            ))}
          </div>
        </Space>
      </Card>

      <div className="sidebar-section-title">{t.learning}</div>
      <Menu
        mode="inline"
        className="sidebar-menu"
        items={learningItems}
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys as string[])}
        onClick={(info) => {
          const [, stage, category] = String(info.key).split(":");
          if (!stage || !category) return;
          onRouteChange(stage, category);
        }}
      />

      <div className="sidebar-section-title">{t.tools}</div>
      <Menu
        mode="inline"
        className="sidebar-menu sidebar-menu--actions"
        selectable={false}
        items={actionItems}
        onClick={(info) => {
          if (info.key === "action:concept") onOpenConcept();
          if (info.key === "action:progress") onOpenInsights();
          if (info.key === "action:setup") onOpenProfile();
          if (info.key === "action:import") onOpenImport();
        }}
      />

      <Card className="sidebar-card sidebar-history" size="small">
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <div className="sidebar-section-title sidebar-section-title--inside">
            {t.recent}
          </div>

          {history.length === 0 ? (
            <Typography.Paragraph className="sidebar-empty">
              {t.empty}
            </Typography.Paragraph>
          ) : (
            <List
              dataSource={history.slice(0, 6)}
              renderItem={(item, index) => (
                <List.Item key={`${item.word}-${index}`} className="sidebar-history-item">
                  <div className="sidebar-history-copy">
                    <span className="sidebar-history-word">{item.word}</span>
                    <span className="sidebar-history-time">{item.timeTaken}s</span>
                  </div>
                  <Tag color={item.correct ? "success" : "warning"}>
                    {item.correct ? "OK" : "Retry"}
                  </Tag>
                </List.Item>
              )}
            />
          )}
        </Space>
      </Card>
    </div>
  );
}
