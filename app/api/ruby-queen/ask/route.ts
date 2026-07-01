import { NextResponse } from "next/server";

const API = "https://api.anthropic.com/v1/messages";
const VER = "2023-06-01";

const SCOPE = `You are Ruby Queen, the point-of-sale service assistant for APEC Group's field technicians.
You help ONLY with point-of-sale, fuel-dispenser, payment-terminal and forecourt service work on Verifone, Ruby, Ruby2, Topaz, Sapphire, Commander, RubyCI and related equipment (dispensers such as Gilbarco, Wayne, Bennett, Tokheim; pinpads such as MX915, M400, P400; networks; card brands; ATG tank monitors). You may also answer questions about a specific APEC/GEO site's equipment and past service history when that context is provided.
If the user asks about anything outside POS / fuel / payment service work, refuse in one short sentence and steer them back.
Be concise and practical, like an experienced field tech. Never invent part numbers, codes, or steps you are not sure of.`;

const pickJSON = (t: string | null) => {
  if (!t) return null;
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a < 0 || b < 0) return null;
  try {
    return JSON.parse(t.slice(a, b + 1));
  } catch (e) {
    return null;
  }
};

const textOf = (d: any) =>
  (d.content || [])
    .filter((c: any) => c.type === "text")
    .map((c: any) => c.text)
    .join("\n")
    .trim();

async function call(body: any) {
  const apiKey = process.env.RUBY_QUEEN_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  const r = await fetch(API, {
    method: "POST",
    headers: {
      "x-api-key": apiKey as string,
      "anthropic-version": VER,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    throw new Error("Anthropic " + r.status + ": " + (await r.text()).slice(0, 300));
  }
  return r.json();
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function webEnabled() {
  return String(process.env.WEB_FALLBACK == null ? "true" : process.env.WEB_FALLBACK).toLowerCase() !== "false";
}

async function webAnswer(question: string) {
  const p = await call({
    model: process.env.ANSWER_MODEL || "claude-sonnet-4-6",
    max_tokens: 700,
    system:
      SCOPE +
      `\n\nUse web search to find a credible answer for this POS / fuel service question, then reply JSON: {"source":"web","answer":"..."}.`,
    tools: [
      {
        type: process.env.WEB_SEARCH_TOOL || "web_search_20250305",
        name: "web_search",
        max_uses: 3,
      },
    ],
    messages: [{ role: "user", content: question }],
  });
  const j = pickJSON(textOf(p));
  return j && j.answer ? j.answer : textOf(p) || "No web answer found.";
}

export async function POST(req: Request) {
  const apiKey = process.env.RUBY_QUEEN_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { source: "none", answer: "Server is missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { question, history = [], context = [], service = [], web = false } = body;

    if (!question) {
      return NextResponse.json({ source: "none", answer: "No question received." });
    }

    if (web === true || web === "true") {
      if (!webEnabled()) {
        return NextResponse.json({ source: "none", answer: "Web search is turned off on the server." });
      }
      return NextResponse.json({ source: "web", answer: await webAnswer(question) });
    }

    const lib =
      context
        .map(
          (e: any) =>
            `#${e.id} ${e.title}\nAnswer: ${e.answer || e.solution || ""}\nProblem: ${
              e.problem || ""
            }`
        )
        .join("\n\n---\n\n") || "(no library entries matched)";
    const svc =
      (Array.isArray(service) ? service : [])
        .slice(0, 5)
        .map(
          (s: any) =>
            `[${s.source}] ${s.site || ""}: ${s.problem || ""}${
              s.solution ? " -> " + s.solution : ""
            }`
        )
        .join("\n") || "(none)";

    const p1 = await call({
      model: process.env.ANSWER_MODEL || "claude-sonnet-4-6",
      max_tokens: 700,
      system:
        SCOPE +
        `\n\nAnswer using the APEC library entries in <library> (the team's verified fixes) and, where helpful, the past service calls in <service>.\nIf the library/service cover it, reply JSON: {"source":"library","answer":"...","entries":[ids used]}.\nIf they do NOT cover it, reply EXACTLY {"source":"none"}. Do not use outside knowledge in this step.`,
      messages: [
        ...(Array.isArray(history) ? history : [])
          .filter((m: any) => m && m.role && m.content)
          .slice(-6),
        {
          role: "user",
          content: `Question: ${question}\n\n<library>\n${lib}\n</library>\n\n<service>\n${svc}\n</service>`,
        },
      ],
    });

    const j1 = pickJSON(textOf(p1)) || { source: "none" };
    if (j1.source === "library" && j1.answer) {
      return NextResponse.json({
        source: "library",
        answer: j1.answer,
        entries: j1.entries || [],
      });
    }

    if (webEnabled()) {
      return NextResponse.json({ source: "web", answer: await webAnswer(question) });
    }

    return NextResponse.json({
      source: "none",
      answer: "That isn't in Ruby Queen's library yet, and web backup is turned off.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { source: "none", answer: "Gateway error: " + String(err.message || err) },
      { status: 500 }
    );
  }
}
