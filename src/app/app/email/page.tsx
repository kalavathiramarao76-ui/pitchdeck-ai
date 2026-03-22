"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import FavoriteButton from "@/components/FavoriteButton";
import ExportMenu from "@/components/ExportMenu";
import { useToast } from "@/components/ToastProvider";

export default function InvestorEmail() {
  const [form, setForm] = useState({
    startup: "",
    oneLiner: "",
    traction: "",
    raising: "",
    investorType: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const generate = async () => {
    if (!form.startup || !form.oneLiner) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "email",
          prompt: `Startup: ${form.startup}\nOne-liner: ${form.oneLiner}\nTraction/Metrics: ${form.traction || "Early stage"}\nRaising: ${form.raising || "Not specified"}\nInvestor Type: ${form.investorType || "VC partner"}\n\nWrite a cold investor outreach email.`,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
      addToast({ title: "Investor email created", variant: "success" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to generate";
      setResult("Error: " + msg);
      addToast({ title: "Generation failed", description: msg, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] noise">
      <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-black font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">PitchDeck AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/app" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div role="main" className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Investor Email Writer
        </h1>
        <p className="text-neutral-400 mb-10">
          Generate cold outreach emails that get meetings. Under 150 words, pure signal.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Startup Name
            </label>
            <input
              type="text"
              value={form.startup}
              onChange={(e) => setForm({ ...form, startup: e.target.value })}
              placeholder="e.g., Runway"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              One-Liner Description
            </label>
            <input
              type="text"
              value={form.oneLiner}
              onChange={(e) => setForm({ ...form, oneLiner: e.target.value })}
              placeholder="e.g., AI-powered video editing that turns text into cinematic content"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Traction & Key Metrics
            </label>
            <textarea
              value={form.traction}
              onChange={(e) => setForm({ ...form, traction: e.target.value })}
              placeholder="e.g., $120K MRR, 15K users, 40% MoM growth, ex-Google founding team"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Raising Amount
              </label>
              <input
                type="text"
                value={form.raising}
                onChange={(e) => setForm({ ...form, raising: e.target.value })}
                placeholder="e.g., $3M Seed"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Target Investor Type
              </label>
              <input
                type="text"
                value={form.investorType}
                onChange={(e) => setForm({ ...form, investorType: e.target.value })}
                placeholder="e.g., Series A VC, Angel, Corporate VC"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading || !form.startup || !form.oneLiner}
            aria-label={loading ? "Generating email" : "Generate investor email"}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-3.5 rounded-xl text-base transition-colors"
          >
            {loading ? "Crafting email..." : "Generate Investor Email"}
          </button>
        </div>

        {loading && (
          <div className="mt-10 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shimmer h-4 rounded-full" style={{ width: `${85 - i * 10}%` }} />
            ))}
          </div>
        )}

        {result && !loading && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Investor Email</h2>
              <div className="flex items-center gap-2">
                <FavoriteButton itemId="pitchdeck-email" itemLabel="Investor Email" size="sm" />
                <ExportMenu content={result} title="Investor Email" />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    addToast({ title: "Copied to clipboard", variant: "info" });
                  }}
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Copy to clipboard
                </button>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 sm:p-8">
              <div className="font-mono text-sm">
                {result.split("\n").map((line, i) => {
                  if (line.toLowerCase().startsWith("subject:"))
                    return (
                      <div key={i} className="text-amber-400 font-semibold text-base mb-4 pb-4 border-b border-white/5">
                        {line}
                      </div>
                    );
                  if (line.trim() === "") return <div key={i} className="h-4" />;
                  return (
                    <p key={i} className="text-neutral-300 leading-relaxed my-0.5">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
