import { NextRequest, NextResponse } from "next/server";
import { aiGenerate } from "@/lib/ai";
import { checkAndIncrementUsage, isAuthenticated } from "@/lib/rate-limit";

const SYSTEM_PROMPTS: Record<string, string> = {
  deck: `You are a world-class pitch deck strategist who has helped raise over $2B in venture funding. Generate a 10-slide pitch deck outline. For each slide, provide:
- Slide number and title
- Key message (one sentence)
- 3-4 bullet points of content
- Speaker notes (2-3 sentences)

The 10 slides should be: 1) Title/Hook, 2) Problem, 3) Solution, 4) Market Size, 5) Business Model, 6) Traction, 7) Competition, 8) Team, 9) Financials, 10) The Ask.

Format each slide clearly with markdown. Be specific, data-driven, and compelling. No generic filler.`,

  slide: `You are an elite pitch deck copywriter. Write compelling, investor-ready copy for the specified slide. Include:
- A powerful headline
- 3-5 key points with supporting detail
- A memorable closing statement
- Speaker notes

Be specific to the startup. Use concrete numbers where possible. Avoid buzzwords and generic statements. Write like you're addressing a Sequoia partner.`,

  email: `You are a cold outreach expert who has helped startups get meetings with top-tier VCs. Write a cold investor email that:
- Has a compelling subject line
- Opens with a hook (not "I hope this finds you well")
- States the opportunity in 2 sentences
- Highlights 2-3 key metrics/traction points
- Has a clear, low-friction CTA
- Is under 150 words in the body

Be direct, confident, and specific. No fluff.`,

  pitch: `You are a pitch coach who has trained YC founders. Generate both a 30-second and 60-second elevator pitch. Each should:
- Open with a hook or surprising stat
- Clearly state the problem and solution
- Include one proof point
- End with a memorable line

The 30-second version should be ~75 words. The 60-second version should be ~150 words. Make them conversational, not robotic. Write them as spoken scripts.`,

  competition: `You are a competitive strategy analyst. Create a competition positioning matrix. Include:
- A comparison table with key differentiators (features, pricing, target market, technology, traction)
- Strategic positioning summary
- Key competitive advantages (moat)
- Potential threats and responses

Format as a clear markdown table followed by analysis. Be honest but strategically position the startup favorably.`,

  financials: `You are a startup financial modeler. Generate a 3-year financial projection narrative. Include:
- Revenue model breakdown
- Year 1, Year 2, Year 3 projections
- Key assumptions clearly stated
- Unit economics (CAC, LTV, margins)
- Path to profitability
- Funding requirements and use of funds

Present numbers in a clear format. Be realistic but show strong growth trajectory. Include best-case and conservative scenarios.`,
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "unknown";

    const authed = await isAuthenticated(ip);

    if (!authed) {
      const { allowed, count } = await checkAndIncrementUsage(ip);
      if (!allowed) {
        return NextResponse.json(
          {
            error: "FREE_LIMIT_REACHED",
            message: `Free trial complete. You've used ${count} of 3 free generations. Sign in with Google to continue.`,
            count,
            remaining: 0,
          },
          { status: 429 }
        );
      }
    }

    const body = await req.json();
    const { type, prompt } = body;

    if (!type || !prompt) {
      return NextResponse.json(
        { error: "Missing type or prompt" },
        { status: 400 }
      );
    }

    const systemPrompt =
      SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.deck;

    const result = await aiGenerate(systemPrompt, prompt);

    return NextResponse.json({ result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Generate API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
