import React from "react";
import { Alert, Button, Card, Space, Typography } from "antd";
import { clearStorageByPrefixes } from "../utils/storage";

const copy = {
  vi: {
    title: "App gặp lỗi khi khởi động",
    description:
      "Dữ liệu học cũ hoặc cache trình duyệt có thể không còn tương thích với phiên bản mới. Bạn có thể reset dữ liệu app để vào lại giao diện ngay.",
    reload: "Tải lại",
    reset: "Reset dữ liệu app",
    details: "Chi tiết lỗi",
  },
  en: {
    title: "The app failed during startup",
    description:
      "Old learning data or cached browser state may no longer match the new app version. You can reset app data and reload safely.",
    reload: "Reload",
    reset: "Reset app data",
    details: "Error details",
  },
};

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("App runtime error", error, info);
  }

  handleReset = () => {
    clearStorageByPrefixes([
      "vocab",
      "themeMode",
      "learningStage",
      "uiLocale",
      "activeDeck",
      "practiceMode",
    ]);
    window.location.reload();
  };

  render() {
    const { children, locale = "vi" } = this.props;
    const t = copy[locale] || copy.vi;

    if (!this.state.hasError) {
      return children;
    }

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          background:
            "radial-gradient(circle at top left, #fffaf1 0%, #f5eddf 42%, #eadbc3 100%)",
        }}
      >
        <Card style={{ maxWidth: 640, width: "100%", borderRadius: 24 }}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {t.title}
            </Typography.Title>
            <Typography.Paragraph style={{ marginBottom: 0 }}>
              {t.description}
            </Typography.Paragraph>
            <Alert
              type="error"
              showIcon
              message={t.details}
              description={String(this.state.error?.message || this.state.error || "")}
            />
            <Space wrap>
              <Button onClick={() => window.location.reload()}>{t.reload}</Button>
              <Button type="primary" danger onClick={this.handleReset}>
                {t.reset}
              </Button>
            </Space>
          </Space>
        </Card>
      </div>
    );
  }
}
