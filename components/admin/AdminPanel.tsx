"use client";

import { useState } from "react";
import { ENTITY_TABS } from "@/components/admin/schemas";
import EntityEditor from "@/components/admin/EntityEditor";
import SettingsEditor from "@/components/admin/SettingsEditor";
import VisitLogViewer from "@/components/admin/VisitLogViewer";

const TABS = [
  ...ENTITY_TABS.map((t) => ({ key: t.key, label: t.label })),
  { key: "visits", label: "Посетители" },
  { key: "settings", label: "Настройки" },
];

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(TABS[0].key);

  const logout = async () => {
    await fetch("/api/session", { method: "DELETE" });
    onClose();
    location.reload();
  };

  const activeTab = ENTITY_TABS.find((t) => t.key === active);

  return (
    <div
      className="admin-scope"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1900,
        background: "#fff",
        color: "#000",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#fff",
          borderBottom: "1px solid #000",
          padding: "20px clamp(20px, 5vw, 64px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div className="mono" style={{ fontSize: 13, letterSpacing: "0.08em" }}>
          Панель управления
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <button onClick={logout} className="mono" style={{ fontSize: 12, opacity: 0.7 }}>
            Выйти
          </button>
          <button onClick={onClose} className="mono" style={{ fontSize: 13 }}>
            Закрыть ✕
          </button>
        </div>
      </div>

      <div
        className="mono"
        style={{
          display: "flex",
          gap: 4,
          padding: "16px clamp(20px, 5vw, 64px) 0",
          flexWrap: "wrap",
          borderBottom: "1px solid #000",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            style={{
              padding: "10px 16px",
              fontSize: 12,
              letterSpacing: "0.04em",
              background: active === tab.key ? "#000" : "transparent",
              color: active === tab.key ? "#fff" : "#000",
              border: "1px solid #000",
              borderBottom: active === tab.key ? "1px solid #000" : "1px solid #000",
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "40px clamp(20px, 5vw, 64px)" }}>
        {active === "settings" ? (
          <SettingsEditor />
        ) : active === "visits" ? (
          <VisitLogViewer />
        ) : activeTab ? (
          <EntityEditor tab={activeTab} />
        ) : null}
      </div>
    </div>
  );
}
