"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const tools = [
  {
    num: "01",
    href: "/app/deck",
    title: "Full Deck",
    desc: "Generate a complete 10-slide pitch deck outline with content, speaker notes, and key messages.",
  },
  {
    num: "02",
    href: "/app/slides",
    title: "Slide Writer",
    desc: "Write compelling copy for individual slides — problem, solution, market, team, financials, ask.",
  },
  {
    num: "03",
    href: "/app/email",
    title: "Investor Email",
    desc: "Cold outreach emails that get meetings, not ghosted. Under 150 words, pure signal.",
  },
  {
    num: "04",
    href: "/app/pitch",
    title: "Pitch Script",
    desc: "30-second and 60-second pitch scripts. Conversational, memorable, designed to hook investors.",
  },
  {
    num: "05",
    href: "/app/deck",
    title: "Competition",
    desc: "Positioning matrix with key differentiators, moat analysis, and strategic positioning.",
  },
  {
    num: "06",
    href: "/app/deck",
    title: "Financials",
    desc: "3-year projection narrative with unit economics, revenue models, and path to profitability.",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] noise">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-black font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">PitchDeck AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/app/settings"
              className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Settings
            </Link>
            <ThemeToggle />
            <Link
              href="/"
              className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-16 pt-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Pitch Studio
            </h1>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold tracking-[0.15em] uppercase">
              Workspace
            </span>
          </div>
          <p className="text-neutral-500 text-lg max-w-xl">
            Investor-ready content, generated in seconds.
          </p>
        </div>

        {/* Tool rows */}
        <div className="space-y-0">
          {tools.map((tool, i) => (
            <Link
              key={i}
              href={tool.href}
              className="group flex items-start gap-8 py-8 border-t border-white/[0.06] last:border-b hover:bg-white/[0.01] transition-colors -mx-6 px-6"
            >
              {/* Number */}
              <span className="font-mono text-sm text-amber-500/40 pt-1 shrink-0 w-8 tabular-nums">
                {tool.num}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-semibold tracking-tight text-white group-hover:text-amber-400 transition-colors mb-2">
                  {tool.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-lg">
                  {tool.desc}
                </p>
              </div>

              {/* Arrow */}
              <div className="pt-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
