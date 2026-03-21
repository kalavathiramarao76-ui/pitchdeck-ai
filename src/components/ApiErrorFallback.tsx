"use client";

import { useState, useEffect, useCallback } from "react";

interface Props {
  error: string;
  onRetry: () => void;
  countdown?: number;
}

export default function ApiErrorFallback({
  error,
  onRetry,
  countdown: initialCountdown = 10,
}: Props) {
  const [seconds, setSeconds] = useState(initialCountdown);
  const [paused, setPaused] = useState(false);

  const handleRetry = useCallback(() => {
    setSeconds(initialCountdown);
    onRetry();
  }, [initialCountdown, onRetry]);

  useEffect(() => {
    if (paused) return;
    if (seconds <= 0) {
      handleRetry();
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, paused, handleRetry]);

  const progress = ((initialCountdown - seconds) / initialCountdown) * 100;

  return (
    <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] backdrop-blur-xl p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-red-300 mb-1">Request Failed</h3>
          <p className="text-xs text-[var(--pd-text-muted,#737373)] leading-relaxed">
            {error || "An error occurred while processing your request."}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--pd-text-muted,#737373)] tabular-nums font-mono">
          {paused ? "Paused" : `Retrying in ${seconds}s`}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPaused((p) => !p)}
            className="px-3 py-1.5 rounded-lg text-xs border border-white/10 hover:border-white/20 text-[var(--pd-text-secondary,#a3a3a3)] hover:text-[var(--pd-text,#fff)] transition-colors"
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={handleRetry}
            className="px-3 py-1.5 rounded-lg text-xs bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors"
          >
            Retry Now
          </button>
        </div>
      </div>
    </div>
  );
}
