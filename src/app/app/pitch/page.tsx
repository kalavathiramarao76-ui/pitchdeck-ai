"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function ElevatorPitch() {
  const [form, setForm] = useState({
    startup: "",
    problem: "",
    solution: "",
    traction: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!form.startup || !form.problem) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pitch",
          prompt: `Startup: ${form.startup}\nProblem: ${form.problem}\nSolution: ${form.solution || "Not specified"}\nTraction/Proof Point: ${form.traction || "Early stage"}\n\nGenerate both 30-second and 60-second elevator pitches.`,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to generate";
      setResult("Error: " + msg);
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Elevator Pitch Generator
        </h1>
        <p className="text-neutral-400 mb-10">
          30-second and 60-second pitches that make investors lean in.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Startup Name & Space
            </label>
            <input
              type="text"
              value={form.startup}
              onChange={(e) => setForm({ ...form, startup: e.target.value })}
              placeholder="e.g., Loom — async video for remote teams"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Problem
            </label>
            <textarea
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
              placeholder="What's the painful problem you're solving?"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Solution
            </label>
            <textarea
              value={form.solution}
              onChange={(e) => setForm({ ...form, solution: e.target.value })}
              placeholder="How does your product solve it?"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Key Proof Point / Traction
            </label>
            <input
              type="text"
              value={form.traction}
              onChange={(e) => setForm({ ...form, traction: e.target.value })}
              placeholder="e.g., 10K users in 3 months, $50K MRR, YC W24"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading || !form.startup || !form.problem}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-3.5 rounded-xl text-base transition-colors"
          >
            {loading ? "Crafting pitches..." : "Generate Elevator Pitches"}
          </button>
        </div>

        {loading && (
          <div className="mt-10 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shimmer h-4 rounded-full" style={{ width: `${90 - i * 12}%` }} />
            ))}
          </div>
        )}

        {result && !loading && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Elevator Pitches</h2>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
                Copy to clipboard
              </button>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 sm:p-8">
              <div className="prose prose-invert prose-amber max-w-none">
                {result.split("\n").map((line, i) => {
                  if (line.startsWith("# "))
                    return <h1 key={i} className="text-2xl font-bold text-amber-400 mt-8 mb-3 first:mt-0">{line.replace("# ", "")}</h1>;
                  if (line.startsWith("## "))
                    return <h2 key={i} className="text-xl font-semibold text-amber-300 mt-6 mb-2">{line.replace("## ", "")}</h2>;
                  if (line.startsWith("### "))
                    return <h3 key={i} className="text-lg font-semibold text-neutral-200 mt-4 mb-2">{line.replace("### ", "")}</h3>;
                  if (line.startsWith("- ") || line.startsWith("* "))
                    return <div key={i} className="flex gap-2 text-neutral-300 ml-4 my-1"><span className="text-amber-500 shrink-0">*</span><span>{line.replace(/^[-*] /, "")}</span></div>;
                  if (line.trim() === "") return <div key={i} className="h-3" />;
                  return <p key={i} className="text-neutral-300 leading-relaxed my-1 text-lg italic">{line}</p>;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
