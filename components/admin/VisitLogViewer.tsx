"use client";

import { useCallback, useEffect, useState } from "react";

type Visit = {
  id: string;
  ip: string;
  userAgent: string;
  language: string;
  path: string;
  createdAt: string;
};

const PAGE_SIZE = 100;

const cellStyle: React.CSSProperties = { padding: "8px 10px", verticalAlign: "top" };

export default function VisitLogViewer() {
  const [items, setItems] = useState<Visit[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    const res = await fetch(`/api/records/visits?page=${p}`);
    const data = await res.json();
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(page);
  }, [load, page]);

  const clear = async () => {
    if (!confirm("Удалить весь журнал посещений?")) return;
    setClearing(true);
    await fetch("/api/records/visits", { method: "DELETE" });
    setClearing(false);
    setPage(0);
    await load(0);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="mono" style={{ fontSize: 12, opacity: 0.7 }}>
          Всего записей: {total}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => load(page)}
            className="mono"
            style={{ border: "1px solid #000", padding: "8px 14px", fontSize: 12 }}
          >
            Обновить
          </button>
          <button
            onClick={clear}
            disabled={clearing || total === 0}
            className="mono"
            style={{ border: "1px solid #000", padding: "8px 14px", fontSize: 12, opacity: total === 0 ? 0.4 : 1 }}
          >
            {clearing ? "Удаление..." : "Очистить журнал"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mono" style={{ fontSize: 12, opacity: 0.6 }}>
          Загрузка...
        </p>
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid #000" }}>
          <table className="mono" style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Время", "IP", "Язык", "Страница", "User-Agent"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #000",
                      padding: "8px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>
                    {new Date(v.createdAt).toLocaleString("ru-RU")}
                  </td>
                  <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>{v.ip}</td>
                  <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>{v.language || "—"}</td>
                  <td style={cellStyle}>{v.path}</td>
                  <td style={{ ...cellStyle, maxWidth: 420, overflow: "hidden", textOverflow: "ellipsis" }} title={v.userAgent}>
                    {v.userAgent || "—"}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 12, opacity: 0.6 }}>
                    Пока нет записей
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mono" style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}>
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            style={{ border: "1px solid #000", padding: "6px 12px", fontSize: 12, opacity: page === 0 ? 0.4 : 1 }}
          >
            ← Назад
          </button>
          <span style={{ fontSize: 12 }}>
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{ border: "1px solid #000", padding: "6px 12px", fontSize: 12, opacity: page + 1 >= totalPages ? 0.4 : 1 }}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
}
