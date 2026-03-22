"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    title: "10-Slide Deck Generator",
    desc: "From idea to investor-ready deck in 60 seconds. Problem, solution, market, traction, team, financials, ask.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    title: "Slide Copywriter",
    desc: "Compelling, VC-grade copy for every single slide. Written like you hired a $500/hr pitch consultant.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    title: "Investor Cold Email",
    desc: "Get meetings, not ghosted. AI writes emails that land in the right inbox and get replies.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    title: "Elevator Pitch Scripts",
    desc: "30-second and 60-second pitches that make investors say 'tell me more' instead of 'interesting'.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    title: "Competition Matrix",
    desc: "Visual positioning against competitors. Know your moat. Show investors you understand the landscape.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-1.5M12 12V7.5" />
      </svg>
    ),
  },
  {
    title: "Financial Projections",
    desc: "3-year projection narratives with unit economics. Revenue models that make CFOs nod.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
];

/* ─── Letter Reveal ─── */
function LetterReveal({ text, className = "", delay = 0 }: {
  text: string; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transitionDelay: visible ? `${delay + i * 32}ms` : "0ms",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

/* ─── Scroll Counter ─── */
function ScrollCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const num = parseInt(value.replace(/\D/g, ""), 10);
  const prefix = value.match(/^[<>]*/)?.[0] || "";

  useEffect(() => {
    const el = ref.current;
    if (!el || isNaN(num)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDisplay("0");
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        obs.disconnect();
        const start = performance.now();
        const dur = 900;
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(prefix + Math.round(eased * num));
          if (t < 1) requestAnimationFrame(tick); else setDisplay(value);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [num, value, prefix]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─── Fade In Observer Hook ─── */
function useFadeIn() {
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      refs.current.forEach(el => { if (el) { el.style.opacity = "1"; el.style.transform = "none"; } });
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0) rotateY(0deg)";
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    refs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const addRef = (el: HTMLElement | null) => {
    if (el && !refs.current.includes(el)) refs.current.push(el);
  };

  return addRef;
}

export default function LandingPage() {
  const addFlipRef = useFadeIn();

  return (
    <div className="min-h-screen bg-[#0a0a0a] noise">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-black font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">PitchDeck AI</span>
          </div>
          <Link
            href="/app"
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 py-2 rounded-full text-sm transition-colors"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-8 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-sm font-medium">
            AI-powered pitch generation
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-8">
            <LetterReveal text="Pitch with" />
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              <LetterReveal text="confidence." delay={350} />
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Generate investor-ready pitch decks, cold emails, elevator pitches,
            and financial projections. Built for founders who ship, not slide.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/app"
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-3.5 rounded-full text-base transition-colors"
            >
              Start Building Your Deck
            </Link>
            <a
              href="#features"
              className="border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-8 py-3.5 rounded-full text-base transition-colors"
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-amber-400"><ScrollCounter value="10" /></div>
            <div className="text-sm text-neutral-500 mt-1">Slide Deck</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-amber-400"><ScrollCounter value="30" suffix="s" /></div>
            <div className="text-sm text-neutral-500 mt-1">Elevator Pitch</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-amber-400"><ScrollCounter value="<60" suffix="s" /></div>
            <div className="text-sm text-neutral-500 mt-1">Generation Time</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-amber-400"><ScrollCounter value="6" /></div>
            <div className="text-sm text-neutral-500 mt-1">AI Tools</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Everything you need to{" "}
              <span className="text-amber-400">raise.</span>
            </h2>
            <p className="text-neutral-400 text-lg max-w-xl mx-auto">
              Six AI-powered tools. One platform. Zero generic templates.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "900px" }}>
            {features.map((f, idx) => (
              <div
                key={f.title}
                ref={addFlipRef}
                className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-amber-500/20 transition-all duration-700"
                style={{
                  opacity: 0,
                  transform: "translateY(24px) rotateY(-12deg)",
                  transitionDelay: `${idx * 80}ms`,
                  transformOrigin: "left center",
                  willChange: "transform, opacity",
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center mb-20">
            Three steps to{" "}
            <span className="text-amber-400">funded.</span>
          </h2>
          <div className="space-y-16">
            {[
              {
                step: "01",
                title: "Describe your startup",
                desc: "Name, problem, solution, market size, business model. The fundamentals that matter.",
              },
              {
                step: "02",
                title: "AI generates everything",
                desc: "10-slide deck, investor emails, elevator pitches, competition analysis, financial projections. All tailored to your startup.",
              },
              {
                step: "03",
                title: "Pitch with confidence",
                desc: "Copy the content into your favorite design tool. Walk into that meeting knowing every word lands.",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-8 items-start">
                <div className="text-5xl font-bold text-amber-500/20 shrink-0 font-mono">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            <LetterReveal text="Stop tweaking slides." />
            <br />
            <span className="text-amber-400"><LetterReveal text="Start raising capital." delay={640} /></span>
          </h2>
          <p className="text-neutral-400 text-lg mb-10">
            Every minute spent on formatting is a minute not spent on building.
          </p>
          <Link
            href="/app"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-black font-semibold px-10 py-4 rounded-full text-lg transition-colors"
          >
            Build Your Pitch Deck Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-black font-bold text-[10px]">P</span>
            </div>
            PitchDeck AI
          </div>
          <div>Built for founders who ship.</div>
        </div>
      </footer>
    </div>
  );
}
