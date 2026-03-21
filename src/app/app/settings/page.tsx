"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Theme = "light" | "dark" | "system";

export default function SettingsPage() {
  const [theme, setThemeLocal] = useState<Theme>("dark");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [model, setModel] = useState("");
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    setMounted(true);
    setThemeLocal(
      (localStorage.getItem("pitchdeck-theme") as Theme) || "dark"
    );
    setEndpointUrl(localStorage.getItem("pitchdeck-endpoint") || "");
    setModel(localStorage.getItem("pitchdeck-model") || "");
  }, []);

  const applyTheme = (t: Theme) => {
    setThemeLocal(t);
    localStorage.setItem("pitchdeck-theme", t);

    const resolved =
      t === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : t;
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
  };

  const saveSettings = () => {
    localStorage.setItem("pitchdeck-endpoint", endpointUrl);
    localStorage.setItem("pitchdeck-model", model);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearAllData = () => {
    if (!confirm("This will remove all saved settings and cached data. Continue?")) return;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("pitchdeck-")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    setEndpointUrl("");
    setModel("");
    setThemeLocal("dark");
    applyTheme("dark");
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  if (!mounted) return null;

  const themes: { value: Theme; label: string; desc: string }[] = [
    { value: "light", label: "Light", desc: "Clean, bright interface" },
    { value: "dark", label: "Dark", desc: "Easy on the eyes" },
    { value: "system", label: "System", desc: "Follow OS preference" },
  ];

  const models = [
    { value: "", label: "Default (auto)" },
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
    { value: "claude-sonnet-4-20250514", label: "Claude Sonnet" },
    { value: "claude-3-haiku-20240307", label: "Claude Haiku" },
  ];

  return (
    <div className="min-h-screen bg-[var(--pd-bg,#0a0a0a)] noise">
      <nav className="border-b border-[var(--pd-border)] bg-[var(--pd-bg,#0a0a0a)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-black font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-[var(--pd-text,#ededed)]">
              PitchDeck AI
            </span>
          </Link>
          <Link
            href="/app"
            className="text-sm text-[var(--pd-text-muted)] hover:text-[var(--pd-text)] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--pd-text,#ededed)] mb-2">
          Settings
        </h1>
        <p className="text-[var(--pd-text-muted)] mb-12">
          Customize your PitchDeck AI experience.
        </p>

        {/* Theme */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-[var(--pd-text-muted)] mb-4">
            Appearance
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => applyTheme(t.value)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  theme === t.value
                    ? "border-amber-500/50 bg-amber-500/10"
                    : "border-[var(--pd-border)] bg-[var(--pd-surface)] hover:border-[var(--pd-text-muted)]/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">
                    {t.value === "light" ? "\u2600" : t.value === "dark" ? "\uD83C\uDF19" : "\uD83D\uDCBB"}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      theme === t.value
                        ? "text-amber-400"
                        : "text-[var(--pd-text)]"
                    }`}
                  >
                    {t.label}
                  </span>
                </div>
                <p className="text-xs text-[var(--pd-text-muted)]">{t.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* API Configuration */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-[var(--pd-text-muted)] mb-4">
            API Configuration
          </h2>
          <div className="space-y-4 p-6 rounded-xl border border-[var(--pd-border)] bg-[var(--pd-surface)]">
            <div>
              <label className="block text-sm font-medium text-[var(--pd-text-secondary)] mb-2">
                Custom Endpoint URL
              </label>
              <input
                type="url"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                placeholder="https://api.openai.com/v1 (leave blank for default)"
                className="w-full bg-[var(--pd-bg)] border border-[var(--pd-border)] rounded-xl px-4 py-3 text-[var(--pd-text)] placeholder-[var(--pd-text-muted)] focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors text-sm"
              />
              <p className="text-xs text-[var(--pd-text-muted)] mt-1.5">
                Override the default API endpoint for self-hosted or proxy setups.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--pd-text-secondary)] mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[var(--pd-bg)] border border-[var(--pd-border)] rounded-xl px-4 py-3 text-[var(--pd-text)] focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors text-sm"
              >
                {models.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={saveSettings}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-colors"
            >
              {saved ? "Saved!" : "Save API Settings"}
            </button>
          </div>
        </section>

        {/* Data */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-[var(--pd-text-muted)] mb-4">
            Data & Storage
          </h2>
          <div className="p-6 rounded-xl border border-[var(--pd-border)] bg-[var(--pd-surface)]">
            <p className="text-sm text-[var(--pd-text-secondary)] mb-4">
              All data is stored locally in your browser. Nothing is sent to external servers beyond API calls for content generation.
            </p>
            <button
              onClick={clearAllData}
              className="px-6 py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium rounded-xl text-sm transition-colors"
            >
              {cleared ? "Cleared!" : "Clear All Data"}
            </button>
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-[var(--pd-text-muted)] mb-4">
            About
          </h2>
          <div className="p-6 rounded-xl border border-[var(--pd-border)] bg-[var(--pd-surface)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-black font-bold">P</span>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--pd-text)]">PitchDeck AI</h3>
                <p className="text-xs text-[var(--pd-text-muted)]">v1.0.0</p>
              </div>
            </div>
            <p className="text-sm text-[var(--pd-text-secondary)] leading-relaxed">
              AI-powered pitch deck generator. Create compelling 10-slide decks,
              investor emails, elevator pitches, competition matrices, and
              financial projections in seconds.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
