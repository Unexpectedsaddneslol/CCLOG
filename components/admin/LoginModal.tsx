"use client";

import { useState, useCallback } from "react";

export default function LoginModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        onSuccess();
      } else if (res.status === 429) {
        setError("Слишком много попыток. Подождите.");
      } else {
        setError("Неверный пароль.");
      }
    } catch {
      setError("Ошибка соединения.");
    } finally {
      setLoading(false);
    }
  }, [password, onSuccess]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#000",
          border: "1px solid #fff",
          color: "#fff",
          width: "min(420px, 90vw)",
          padding: "40px 32px",
        }}
      >
        <div
          className="mono"
          style={{ fontSize: 12, letterSpacing: "0.1em", opacity: 0.6, marginBottom: 24 }}
        >
          Access
        </div>
        <input
          autoFocus
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") onClose();
          }}
          placeholder="пароль"
          className="mono"
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            borderBottom: "1px solid #fff",
            color: "#fff",
            fontSize: 16,
            padding: "10px 0",
            outline: "none",
            marginBottom: 20,
          }}
        />
        {error && (
          <div className="mono" style={{ fontSize: 12, color: "#fff", opacity: 0.8, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <button
          onClick={submit}
          disabled={loading}
          className="mono"
          style={{
            width: "100%",
            border: "1px solid #fff",
            padding: "12px 0",
            fontSize: 13,
            letterSpacing: "0.08em",
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? "..." : "Войти"}
        </button>
      </div>
    </div>
  );
}
