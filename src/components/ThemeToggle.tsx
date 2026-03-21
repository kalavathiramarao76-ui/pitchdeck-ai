"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;

  if (resolved === "light") {
    root.setAttribute("data-theme", "light");
    root.style.setProperty("--pd-bg", "#f8f8f8");
    root.style.setProperty("--pd-bg-card", "#ffffff");
    root.style.setProperty("--pd-bg-hover", "#f0f0f0");
    root.style.setProperty("--pd-text", "#0a0a0a");
    root.style.setProperty("--pd-text-secondary", "#525252");
    root.style.setProperty("--pd-text-muted", "#737373");
    root.style.setProperty("--pd-border", "rgba(0,0,0,0.1)");
    root.style.setProperty("--pd-surface", "rgba(0,0,0,0.03)");
  } else {
    root.setAttribute("data-theme", "dark");
    root.style.setProperty("--pd-bg", "#0a0a0a");
    root.style.setProperty("--pd-bg-card", "#111111");
    root.style.setProperty("--pd-bg-hover", "#1a1a1a");
    root.style.setProperty("--pd-text", "#ededed");
    root.style.setProperty("--pd-text-secondary", "#a3a3a3");
    root.style.setProperty("--pd-text-muted", "#737373");
    root.style.setProperty("--pd-border", "rgba(255,255,255,0.06)");
    root.style.setProperty("--pd-surface", "rgba(255,255,255,0.03)");
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pitchdeck-theme") as Theme | null;
    const initial = stored || "dark";
    setThemeState(initial);
    applyTheme(initial);
    setMounted(true);

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = localStorage.getItem("pitchdeck-theme") as Theme | null;
      if (current === "system") applyTheme("system");
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("pitchdeck-theme", t);
    applyTheme(t);
  };

  return { theme, setTheme, mounted };
}

// Sun icon
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// Moon icon
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

// Monitor icon (system)
function MonitorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const modes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: "light", icon: <SunIcon />, label: "Light" },
    { value: "dark", icon: <MoonIcon />, label: "Dark" },
    { value: "system", icon: <MonitorIcon />, label: "System" },
  ];

  const cycle = () => {
    const order: Theme[] = ["dark", "light", "system"];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const current = modes.find((m) => m.value === theme)!;

  return (
    <button
      onClick={cycle}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 text-neutral-400 hover:text-amber-400"
      title={`Theme: ${current.label}`}
      aria-label={`Current theme: ${current.label}. Click to cycle.`}
    >
      {current.icon}
    </button>
  );
}
