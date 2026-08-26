"use client";

import { useCallback, useRef, useState } from "react";

export default function DropUpload({
  value,
  onChange,
  kind,
}: {
  value: string;
  onChange: (url: string) => void;
  kind: "image" | "pdf";
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = kind === "image" ? "image/png,image/jpeg,image/webp,image/svg+xml,image/gif" : "application/pdf";

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.ok) {
          onChange(data.url);
        } else {
          setError("Не удалось загрузить файл.");
        }
      } catch {
        setError("Ошибка загрузки.");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) upload(file);
    },
    [upload]
  );

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: `1px dashed ${dragOver ? "#000" : "#999"}`,
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 14,
          cursor: "pointer",
          background: dragOver ? "#f2f2f2" : "transparent",
        }}
      >
        {kind === "image" && value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" style={{ width: 56, height: 56, objectFit: "cover", flexShrink: 0 }} />
        ) : null}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mono" style={{ fontSize: 12 }}>
            {uploading
              ? "Загрузка..."
              : value
              ? kind === "pdf"
                ? value.split("/").pop()
                : "Перетащите файл, чтобы заменить"
              : "Перетащите файл сюда или нажмите, чтобы выбрать"}
          </div>
          {value && kind === "pdf" && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mono"
              style={{ fontSize: 11, opacity: 0.6, textDecoration: "underline" }}
            >
              открыть PDF
            </a>
          )}
        </div>

        <span className="mono" style={{ fontSize: 11, border: "1px solid #000", padding: "6px 10px", flexShrink: 0 }}>
          Обзор
        </span>
      </div>

      {error && (
        <div className="mono" style={{ fontSize: 11, color: "#c00", marginTop: 6 }}>
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
