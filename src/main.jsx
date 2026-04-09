import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AppErrorBoundary from "./components/AppErrorBoundary";
import "antd/dist/reset.css";
import "./index.css";

const bootstrapLocale =
  typeof window !== "undefined" && window.localStorage.getItem("uiLocale") === "en"
    ? "en"
    : "vi";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary locale={bootstrapLocale}>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
