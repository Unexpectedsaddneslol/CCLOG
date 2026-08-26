"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import LoginModal from "@/components/admin/LoginModal";
import AdminPanel from "@/components/admin/AdminPanel";

const NAV = [
  { href: "/services", label: "Услуги" },
  { href: "/investigations", label: "Расследования" },
  { href: "/articles", label: "Статьи" },
  { href: "/#tools", label: "Инструменты" },
  { href: "/#followers", label: "Последователи" },
  { href: "/#join", label: "Вступить к нам" },
];

const CLICKS_REQUIRED = 16;
const CLICK_RESET_MS = 1400;

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch("/api/session")
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authed)))
      .catch(() => {});
  }, []);

  const onLogoClick = useCallback(
    (e: React.MouseEvent) => {
      clickCount.current += 1;
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, CLICK_RESET_MS);

      if (clickCount.current >= CLICKS_REQUIRED) {
        clickCount.current = 0;
        setShowLogin(true);
      }

      // Already home: never navigate (no scroll-reset), just count the click.
      // Away from home: let the Link do a normal navigation back to "/".
      if (isHome) {
        e.preventDefault();
      }
    },
    [isHome]
  );

  return (
    <>
      {/* Extends the header's own black upward under the notch/status-bar
          area (viewport-fit:cover in layout.tsx makes the page's viewport
          reach that far; without something actually painting black there,
          it's just left to whatever the browser/in-app-webview defaults
          to, usually white — theme-color is only a hint some browsers
          ignore). env() resolves to 0 with no real inset, so this is a
          no-op on any device without a notch. */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "env(safe-area-inset-top, 0px)",
          background: "#000",
          zIndex: 501,
        }}
      />
      <header
        style={{
          position: "fixed",
          top: "env(safe-area-inset-top, 0px)",
          left: 0,
          right: 0,
          zIndex: 500,
          background: "#000",
          color: "#fff",
          borderBottom: "1px solid #fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
            padding: "0 clamp(20px, 4vw, 40px)",
          }}
        >
          <Link
            href="/"
            scroll={false}
            onClick={onLogoClick}
            aria-label="Контр-Культура"
            className="header-logo"
            style={{ display: "block", position: "relative" }}
          >
            <Image src="/assets/main/logo.jpg" alt="" fill sizes="60px" style={{ objectFit: "cover" }} />
          </Link>

          <nav
            className="mono header-nav-full"
            style={{
              gap: "clamp(10px, 2vw, 26px)",
              fontSize: 12,
              letterSpacing: "0.04em",
            }}
          >
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} style={{ whiteSpace: "nowrap" }}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-nav-toggle" ref={menuRef}>
            <button
              className="header-burger"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Меню"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
            {menuOpen && (
              <nav className="mono header-dropdown">
                {NAV.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </header>

      {authed && !showPanel && (
        <button
          onClick={() => setShowPanel(true)}
          className="mono"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 600,
            background: "#fff",
            color: "#000",
            border: "1px solid #fff",
            padding: "10px 16px",
            fontSize: 12,
          }}
        >
          Админ
        </button>
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false);
            setAuthed(true);
            setShowPanel(true);
          }}
        />
      )}

      {showPanel && <AdminPanel onClose={() => setShowPanel(false)} />}
    </>
  );
}
