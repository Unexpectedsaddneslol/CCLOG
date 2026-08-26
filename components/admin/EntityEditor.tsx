"use client";

import { useCallback, useEffect, useState } from "react";
import type { EntityTab } from "@/components/admin/schemas";
import DropUpload from "@/components/admin/DropUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Item = Record<string, unknown> & { id: string };

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #000",
  padding: "8px 10px",
  fontSize: 14,
  background: "#fff",
  color: "#000",
};

export default function EntityEditor({ tab }: { tab: EntityTab }) {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/records/${tab.key}`);
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }, [tab.key]);

  useEffect(() => {
    load();
    setSelectedId(null);
    setDraft(null);
  }, [load]);

  const select = (item: Item) => {
    setSelectedId(item.id);
    setDraft({ ...item });
  };

  const createNew = async () => {
    setSaving(true);
    const res = await fetch(`/api/records/${tab.key}`, { method: "POST", body: JSON.stringify({}) });
    const data = await res.json();
    setSaving(false);
    await load();
    if (data.item) select(data.item);
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    await fetch(`/api/records/${tab.key}/${draft.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSaving(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить запись?")) return;
    await fetch(`/api/records/${tab.key}/${id}`, { method: "DELETE" });
    if (selectedId === id) {
      setSelectedId(null);
      setDraft(null);
    }
    await load();
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 32 }}>
      <div>
        <button
          onClick={createNew}
          disabled={saving}
          className="mono"
          style={{ border: "1px solid #000", padding: "8px 14px", fontSize: 12, marginBottom: 16, width: "100%" }}
        >
          + Добавить
        </button>

        {loading ? (
          <p className="mono" style={{ fontSize: 12, opacity: 0.6 }}>
            Загрузка...
          </p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, border: "1px solid #000" }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  borderBottom: "1px solid #000",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => select(item)}
                  style={{
                    flex: 1,
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: 14,
                    background: selectedId === item.id ? "#000" : "transparent",
                    color: selectedId === item.id ? "#fff" : "#000",
                    opacity: item.published === false ? 0.5 : 1,
                  }}
                >
                  {tab.itemLabel(item) || "(без названия)"}
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="mono"
                  style={{ padding: "10px 12px", fontSize: 12 }}
                  title="Удалить"
                >
                  ✕
                </button>
              </li>
            ))}
            {items.length === 0 && (
              <li style={{ padding: 12, fontSize: 13, opacity: 0.6 }}>Пока нет записей</li>
            )}
          </ul>
        )}
      </div>

      <div>
        {!draft && <p style={{ opacity: 0.6 }}>Выберите запись слева или добавьте новую.</p>}
        {draft && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 820 }}>
            {tab.fields.map((field) => (
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
                {field.type === "richtext" && (
                  <RichTextEditor
                    value={String(draft[field.key] ?? "")}
                    onChange={(html) => setDraft({ ...draft, [field.key]: html })}
                  />
                )}
                {(field.type === "image" || field.type === "pdf") && (
                  <DropUpload
                    kind={field.type}
                    value={String(draft[field.key] ?? "")}
                    onChange={(url) => setDraft({ ...draft, [field.key]: url })}
                  />
                )}
                {field.type === "number" && (
                  <input
                    type="number"
                    value={Number(draft[field.key] ?? 0)}
                    onChange={(e) => setDraft({ ...draft, [field.key]: Number(e.target.value) })}
                    style={inputStyle}
                  />
                )}
                {field.type === "checkbox" && (
                  <input
                    type="checkbox"
                    checked={draft[field.key] !== false}
                    onChange={(e) => setDraft({ ...draft, [field.key]: e.target.checked })}
                    style={{ width: 18, height: 18 }}
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
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
