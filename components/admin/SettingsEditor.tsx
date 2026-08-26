"use client";

import { useEffect, useState } from "react";
import { SETTINGS_FIELDS } from "@/components/admin/schemas";
import DropUpload from "@/components/admin/DropUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Settings = Record<string, unknown>;

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #000",
  padding: "8px 10px",
  fontSize: 14,
  background: "#fff",
  color: "#000",
};

export default function SettingsEditor() {
  const [draft, setDraft] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/records/settings")
      .then((r) => r.json())
      .then((d) => setDraft(d.item ?? {}));
  }, []);

  if (!draft) return <p style={{ opacity: 0.6 }}>Загрузка...</p>;

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/records/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSaving(false);
    setSaved(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 820 }}>
      {SETTINGS_FIELDS.map((field) => (
        <div key={field.key}>
          <label
            className="mono"
            style={{ display: "block", fontSize: 11, letterSpacing: "0.05em", marginBottom: 6, opacity: 0.7 }}
          >
            {field.label}
          </label>
          {field.type === "textarea" && (
            <textarea
              value={String(draft[field.key] ?? "")}
              onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          )}
          {field.type === "text" && (
            <input
              value={String(draft[field.key] ?? "")}
              onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
              style={inputStyle}
            />
          )}
          {field.type === "image" && (
            <DropUpload
              kind="image"
              value={String(draft[field.key] ?? "")}
              onChange={(url) => setDraft({ ...draft, [field.key]: url })}
            />
          )}
          {field.type === "richtext" && (
            <RichTextEditor
              value={String(draft[field.key] ?? "")}
              onChange={(html) => setDraft({ ...draft, [field.key]: html })}
            />
          )}
        </div>
      ))}

      <button
        onClick={save}
        disabled={saving}
        className="mono"
        style={{ border: "1px solid #000", background: "#000", color: "#fff", padding: "12px 0", fontSize: 13 }}
      >
        {saving ? "Сохранение..." : saved ? "Сохранено" : "Сохранить"}
      </button>
    </div>
  );
}
