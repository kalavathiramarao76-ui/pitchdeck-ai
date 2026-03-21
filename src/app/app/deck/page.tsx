"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import ApiErrorFallback from "@/components/ApiErrorFallback";

export default function DeckGenerator() {
  const [form, setForm] = useState({
    name: "",
    problem: "",
    solution: "",
    market: "",
    model: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [mode, setMode] = useState<"deck" | "competition" | "financials">("deck");

  const generate = async () => {
    if (mode === "deck" && (!form.name || !form.problem || !form.solution)) return;
    setLoading(true);
    setResult("");
    setApiError("");
    try {
      let prompt = "";
      const type = mode;

      if (mode === "deck") {
        prompt = `Startup: ${form.name}\nProblem: ${form.problem}\nSolution: ${form.solution}\nMarket Size: ${form.market || "Not specified"}\nBusiness Model: ${form.model || "Not specified"}`;
      } else if (mode === "competition") {
        prompt = `Startup: ${form.name}\nOur Solution: ${form.solution}\nCompetitors and market context: ${form.problem}\nMarket: ${form.market || "Not specified"}`;
      } else {
        prompt = `Startup: ${form.name}\nBusiness Model: ${form.model || "Not specified"}\nMarket Size: ${form.market || "Not specified"}\nFinancial assumptions and context: ${form.problem}\nSolution/Product: ${form.solution}`;
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to generate";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const labels: Record<string, { title: string; subtitle: string; problemLabel: string; problemPlaceholder: string }> = {
    deck: {
      title: "10-Slide Pitch Deck",
      subtitle: "Generate a complete investor-ready deck outline",
      problemLabel: "Problem",
      problemPlaceholder: "What problem does your startup solve?",
    },
    competition: {
      title: "Competition Matrix",
      subtitle: "Generate a competitive positioning analysis",
      problemLabel: "Competitors",
      problemPlaceholder: "List your main competitors and their key features...",
    },
    financials: {
      title: "Financial Projections",
      subtitle: "Generate a 3-year financial projection narrative",
      problemLabel: "Assumptions",
      problemPlaceholder: "Revenue assumptions, pricing, growth rate, costs, team size...",
    },
  };

  const current = labels[mode];

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
        {/* Mode switcher */}
        <div className="flex gap-2 mb-8">
          {(["deck", "competition", "financials"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-amber-500 text-black"
                  : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {m === "deck" ? "10-Slide Deck" : m === "competition" ? "Competition" : "Financials"}
            </button>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          {current.title}
        </h1>
        <p className="text-neutral-400 mb-10">{current.subtitle}</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Startup Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Stripe, Notion, Linear"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              {current.problemLabel}
            </label>
            <textarea
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
              placeholder={current.problemPlaceholder}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Solution / Product
            </label>
            <textarea
              value={form.solution}
              onChange={(e) => setForm({ ...form, solution: e.target.value })}
              placeholder="What does your product do? How does it solve the problem?"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Market Size
              </label>
              <input
                type="text"
                value={form.market}
                onChange={(e) => setForm({ ...form, market: e.target.value })}
                placeholder="e.g., $50B TAM, growing 25% YoY"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Business Model
              </label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="e.g., SaaS, $99/mo per seat"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading || (!form.name && !form.problem)}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-3.5 rounded-xl text-base transition-colors"
          >
            {loading ? "Generating..." : `Generate ${current.title}`}
          </button>
        </div>

        {loading && (
          <div className="mt-10 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="shimmer h-4 rounded-full" style={{ width: `${85 - i * 10}%` }} />
            ))}
          </div>
        )}

        {apiError && !loading && (
          <div className="mt-10">
            <ApiErrorFallback error={apiError} onRetry={generate} />
          </div>
        )}

        {result && !loading && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Generated Content</h2>
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
                    return (
                      <h1 key={i} className="text-2xl font-bold text-amber-400 mt-8 mb-3 first:mt-0">
                        {line.replace("# ", "")}
                      </h1>
                    );
                  if (line.startsWith("## "))
                    return (
                      <h2 key={i} className="text-xl font-semibold text-amber-300 mt-6 mb-2">
                        {line.replace("## ", "")}
                      </h2>
                    );
                  if (line.startsWith("### "))
                    return (
                      <h3 key={i} className="text-lg font-semibold text-neutral-200 mt-4 mb-2">
                        {line.replace("### ", "")}
                      </h3>
                    );
                  if (line.startsWith("- ") || line.startsWith("* "))
                    return (
                      <div key={i} className="flex gap-2 text-neutral-300 ml-4 my-1">
                        <span className="text-amber-500 shrink-0">*</span>
                        <span>{line.replace(/^[-*] /, "")}</span>
                      </div>
                    );
                  if (line.startsWith("|"))
                    return (
                      <div key={i} className="text-sm text-neutral-300 font-mono bg-white/[0.02] px-3 py-1 border-b border-white/5">
                        {line}
                      </div>
                    );
                  if (line.trim() === "") return <div key={i} className="h-3" />;
                  return (
                    <p key={i} className="text-neutral-300 leading-relaxed my-1">
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
